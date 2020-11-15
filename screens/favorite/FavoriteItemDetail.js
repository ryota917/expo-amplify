import React from 'react';
import { Image, View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-elements';
import * as gqlQueries from '../../src/graphql/queries'
import * as gqlMutations from '../../src/graphql/mutations'
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Swiper from 'react-native-swiper'
import Modal from 'react-native-modal'

export default class FavoriteItemDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: this.props.navigation.state.params.item,
            currentUserEmail: '',
            isFavorited: true,
            //WAITINGのアイテムでなければカートに入れることができない
            isCarted: false,
            //カート内がいっぱいであればカートに入れることはできない
            isCartFilled: false,
            isCartModalVisible: false,
            isAlertModalVisible: false,
            //ユーザーがレンタル中であればカートを使うことはできない
            isRental: false
        }
    }

    static navigationOptions = ({navigation: { navigate }}) => ({
        title: 'アイテム詳細',
        headerLeft:() => <Icon name="chevron-left" size={42} onPress={()=>{navigate('FavoriteTab')}} style={{ paddingLeft: wp('3%')}} />
    });

    componentDidMount = async () => {
        await this.fetchCurrentUser()
        this.setCarted()
        this.fetchCartData()
        this.fetchIsRental()
        this.props.navigation.addListener('didFocus', async () => {
            this.setCarted()
            this.fetchCartData()
            this.fetchIsRental()
        })
    }

    fetchCurrentUser = async () => {
        const currentUser = await Auth.currentAuthenticatedUser()
        const currentUserEmail = currentUser.attributes.email
        this.setState({ currentUserEmail: currentUserEmail })
    }

    setCarted = () => {
        const isCarted = this.props.navigation.state.params.item.status !== 'WAITING'
        this.setState({
            isCarted: isCarted
        })
    }

    //カートにアイテムが4つ入っているかを確認
    fetchCartData = async () => {
        const cart = await API.graphql(graphqlOperation(gqlQueries.getCart, { id: this.state.currentUserEmail }))
        const isCartFilled = cart.data.getCart.itemCarts.items.length >= 4
        this.setState({ isCartFilled: isCartFilled })
    }

    //お気に入りに追加
    saveItemToFavorite = async () => {
        this.setState({ isFavorited: true })
        const { currentUserEmail, item } = this.state
        console.log('お気に入りボタンが押されました')
        await API.graphql(graphqlOperation(gqlMutations.createItemFavorite, {
            input: {
                id: currentUserEmail + item["id"],
                itemId: item["id"],
                userId: currentUserEmail
            }
        }))
    }

    //ユーザーがレンタル中かどうかを確認
    fetchIsRental = async () => {
        const user = await API.graphql(graphqlOperation(gqlQueries.getUser, { id: this.state.currentUserEmail }))
        const isRental = user.data.getUser.rental
        this.setState({ isRental: isRental })
    }

    //お気に入りから削除
    deleteItemFromFavorite = async () => {
        this.setState({ isFavorited: false })
        const { currentUserEmail, item } = this.state
        console.log('お気に入りから削除されました')
        await API.graphql(graphqlOperation(gqlMutations.deleteItemFavorite, {
            input: {
                id: currentUserEmail + item["id"]
            }
        }))
    }

    //カートに追加
    saveItemToCart = async () => {
        const { currentUserEmail, item } = this.state
        this.toggleCartModal()
        this.setState({ isCarted: true })
        try {
            //アイテムがWAITINGであることを確認できればカート保存処理を実行
            const itemData = await API.graphql(graphqlOperation(gqlQueries.getItem, { id: item["id"] }))
            if(itemData.data.getItem.status === 'WAITING') {
                await API.graphql(graphqlOperation(gqlMutations.updateItem, {
                    input: {
                        id: item["id"],
                        status: 'CARTING'
                    }
                }))
                await API.graphql(graphqlOperation(gqlMutations.createItemCart, {
                    input: {
                        id: currentUserEmail + item["id"],
                        itemId: item["id"],
                        cartId: currentUserEmail
                    }
                }))
            }
        } catch(err) {
            console.error(err)
        }
    }

    //モーダルを開閉
    toggleCartModal = () => {
        this.setState({ isCartModalVisible: !this.state.isCartModalVisible })
    }

    toggleAlertModal = () => {
        this.setState({ isAlertModalVisible: !this.state.isAlertModalVisible })
    }

    navigateCartTab = () => {
        this.toggleCartModal()
        //カートアイテム取得にラグがあるので1秒タイムアウトを取る
        setTimeout(() => this.props.navigation.navigate('CartTab'), 2000)
    }

    render() {
        const { item, isFavorited, isCarted, isCartFilled, isRental } = this.state
        const imagesDom = item.imageURLs.map((imgUrl, idx) =>
            <Image key={idx} source={{ uri: imgUrl }} style={{ width: wp('100%'), height: wp('100%') }}/>
        )
        let alertText = ''
        if(isRental) {
            alertText = 'レンタル中のアイテムを返却すると\nカートにアイテムを入れることが\nできるようになります'
        } else if(isCarted) {
            alertText = 'このアイテムはレンタル中です'
        } else if(isCartFilled) {
            alertText = 'カートがいっぱいです'
        }
        return(
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Modal isVisible={this.state.isCartModalVisible}>
                        <View style={styles.modalContainerView}>
                            <View style={styles.modalInnerView}>
                            <Image source={require('../../assets/taggu-cart.png')} style={{ width: wp('25%'), height: hp('25%'), resizeMode: 'contain' }} />
                                <Text style={styles.modalText}>アイテムをカートに追加しました！</Text>
                                <View style={styles.modalButtonView}>
                                    <Button
                                        title='戻る'
                                        buttonStyle={{ borderRadius: 25, width: wp('30%'), height: hp('6%'), backgroundColor: '#333333' }}
                                        titleStyle={{ fontSize: 14, color: 'white' }}
                                        onPress={() => this.toggleCartModal()}
                                    />
                                    <Button
                                        title='カートを見る'
                                        buttonStyle={{ marginLeft: wp('3%'), borderRadius: 25, width: wp('27%'), height: hp('6%'), backgroundColor: '#7389D9' }}
                                        titleStyle={{ fontSize: 14, color: 'white' }}
                                        onPress={() => this.navigateCartTab()}
                                    />
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <Modal isVisible={this.state.isAlertModalVisible}>
                        <View style={styles.modalContainerView}>
                            <View style={styles.modalInnerView}>
                                <Text style={styles.modalText}>{alertText}</Text>
                                    <Button
                                        title='OK'
                                        buttonStyle={{ borderRadius: 25, width: wp('30%'), height: hp('6%'), backgroundColor: '#7389D9', marginTop: hp('2%') }}
                                        titleStyle={{ fontSize: 14, color: 'white' }}
                                        onPress={() => this.toggleAlertModal()}
                                    />
                            </View>
                        </View>
                    </Modal>
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.innerContainer}>
                            <View style={styles.imagesView}>
                                <Swiper
                                    style={styles.swiper}
                                    showButtons={true}
                                    activeDotColor='#7389D9'
                                    dotStyle={{ top: hp('7%')}}
                                    activeDotStyle={{ top: hp('7%')}}
                                >
                                    {imagesDom}
                                </Swiper>
                            </View>
                            <View style={styles.textView}>
                                <View style={styles.flexRowView}>
                                    <View style={styles.titleView}>
                                        {/* ブランド */}
                                        <View style={styles.brandView}>
                                            <Text style={styles.brandText}>{item.brand}</Text>
                                        </View>
                                        {/* アイテム名 */}
                                        <View style={styles.nameView}>
                                            <Text style={styles.nameText}>{item.name}</Text>
                                        </View>
                                        {/* カテゴリ名 */}
                                        <View style={styles.categoryView}>
                                            <Text style={styles.categoryText}>{item.bigCategory === 'OUTER' ? 'アウター' : 'トップス'}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.iconView}>
                                        {/* bookmark-minus-outline */}
                                        <Icon
                                            name={isFavorited ? 'bookmark-minus' : 'bookmark-minus-outline'}
                                            size={40}
                                            onPress={isFavorited ? () => this.deleteItemFromFavorite() : () => this.saveItemToFavorite()}
                                        />
                                    </View>
                                </View>
                                {/* サイズ */}
                                <View style={styles.sizeView}>
                                    <Image source={require('../../assets/vector.png')} style={{ width: wp('30%'), height: wp('30%'), resizeMode: 'contain' }} />
                                    <View style={styles.sizeTextView}>
                                        <Text style={styles.sizeText}>①着丈 {item.dressLength}cm</Text>
                                        <Text style={styles.sizeText}>②身幅 {item.dressWidth}cm</Text>
                                        <Text style={styles.sizeText}>③袖幅 {item.sleeveLength}cm</Text>
                                    </View>
                                </View>
                                {/* 状態 */}
                                <View style={styles.stateView}>
                                    <Text style={styles.stateTitleText}>状態</Text>
                                    <View style={styles.stateInnerView}>
                                        <Text style={styles.stateRankText}>{item.rank}ランク</Text>
                                        <Text style={styles.stateDescriptionText}>{item.stateDescription}</Text>
                                    </View>
                                </View>
                                {/* 説明 */}
                                <View style={styles.descriptionView}>
                                    <Text style={styles.descriptionTitleText}>説明</Text>
                                    <Text style={styles.descriptionText}>{item.description}</Text>
                                </View>
                                <View style={{ height: hp('17%') }}></View>
                            </View>
                        </View>
                    </ScrollView>
                    <View style={[styles.footerView, { bottom: isRental ? hp('12%') : hp('7%') }]}>
                        <View style={styles.footerInnerView}>
                            {isRental ?
                                <View style={styles.cartAlertView}>
                                    <Text style={styles.cartAlertText}>現在レンタル中のアイテムを返却すると{'\n'}カートが使えるようになります</Text>
                                    <Image source={require('../../assets/mini-taggu.png')} style={{ width: wp('8%'), height: wp('8%'), resizeMode: 'contain', backgroundColor: 'white' }} />
                                </View>
                            :  null
                            }
                            <Button
                                icon={
                                    <Icon name='cart' size={20} style={{ color: 'white', marginRight: wp('4%') }}  />
                                }
                                title="カートに入れる"
                                titleStyle={{ color: 'white' }}
                                buttonStyle={{ backgroundColor: (isCarted || isCartFilled || isRental) ? 'rgba(115,137,217, 0.65)' : '#7389D9', borderRadius: 23, width: wp('80%'), height: hp('7%') }}
                                onPress={isRental ? () => null : (isCarted || isCartFilled) ? () => this.toggleAlertModal() : () => this.saveItemToCart()}
                            />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        width: wp('100%'),
        height: hp('100%')
    },
    scrollView: {
        width: wp('100%'),
        height: hp('100%'),
        flex: 1
    },
    innerContainer: {
        width: wp('80%')
    },
    imagesView: {
        width: wp('100%'),
        height: wp('80%')
    },
    swiper: {
    },
    image: {
        width: wp('100%'),
        height: wp('100%')
    },
    textView: {
        marginTop: hp('3%'),
        width: wp('80%'),
        left: wp('10%')
    },
    flexRowView: {
        flexDirection: 'row'
    },
    iconView: {
        position: 'absolute',
        right: wp('0%')
    },
    titleView: {
    },
    brandView: {
    },
    brandText: {
        color: '#7389D9',
        fontSize: 16
    },
    nameView: {
        marginTop: hp('0.3%')
    },
    nameText: {
        fontSize: 20
    },
    categoryView: {
        marginTop: hp('1%')
    },
    categoryText: {
        fontSize: 13,
        color: 'grey'
    },
    sizeView: {
        marginTop: hp('2%'),
        flexDirection: 'row'
    },
    sizeTextView: {
        marginLeft: wp('10%')
    },
    sizeText: {
        marginBottom: hp('0.5%')
    },
    stateView: {
        marginTop: hp('2%'),
        flexDirection: 'row'
    },
    stateInnerView: {
        width: wp('60%'),
        marginLeft: wp('10%')
    },
    stateTitleText: {
        fontSize: 18
    },
    stateRankText: {
        backgroundColor: '#C4C4C4',
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        width: wp('20%')
    },
    stateDescriptionText: {
        marginTop: hp('2%')
    },
    descriptionView: {
        marginTop: hp('3%')
    },
    descriptionTitleText: {
        fontSize: 18
    },
    descriptionText: {
        marginTop: hp('2%')
    },
    footerView: {
        height: hp('20%'),
        bottom: hp('7%'),
    },
    footerInnerView: {
        flex: 1,
        alignItems: 'center',
    },
    modalContainerView: {
        backgroundColor: 'white',
        width: wp('70%'),
        height: hp('40%'),
        left: wp('10%'),
        textAlign: 'center',
        borderRadius: 15
    },
    modalInnerView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalText: {
        fontWeight: '500',
        marginBottom: hp('2%')
    },
    modalButtonView: {
        flexDirection: 'row'
    },
    cartAlertView: {
        flexDirection: 'row',
        borderColor: 'black',
        borderWidth: 2
    },
    cartAlertText: {
        padding: 2,
        backgroundColor: 'white',
        fontSize: 13
    }
})
