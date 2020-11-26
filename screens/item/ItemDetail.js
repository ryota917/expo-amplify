import React from 'react';
import { Platform, Image, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-elements';
import * as gqlQueries from '../../src/graphql/queries'
import * as gqlMutations from '../../src/graphql/mutations'
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Modal from 'react-native-modal'
import FastImage from 'react-native-fast-image'
import ItemDetailScreen from './ItemDetailScreen'

export default class ItemDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: this.props.navigation.state.params.item,
            currentUserEmail: '',
            isFavorited: false,
            //WAITINGのアイテムでなければカートに入れることができない
            isCarted: false,
            //カート内がいっぱいであればカートに入れることはできない
            isCartFilled: false,
            isCartModalVisible: false,
            isAlertModalVisible: false,
            //レンタル中であればカートを使うことはできない
            isRental: false
        }
    }

    static navigationOptions = ({navigation: { navigate }}) => ({
        title: 'アイテム詳細',
        headerLeft:() => <Icon name="chevron-left" size={Platform.isPad ? 60 : 42} onPress={()=>{navigate('ItemTab')}} />,
        headerStyle: {
            height: hp('7%')
        }
    });

    componentDidMount = async () => {
        await this.fetchCurrentUser()
        this.setFavoritedOrCarted()
        this.fetchCartData()
        this.fetchIsRental()
        this.props.navigation.addListener('didFocus', async () => {
            this.setFavoritedOrCarted()
            this.fetchCartData()
            this.fetchIsRental()
        })
    }

    //ログインユーザーをセット
    fetchCurrentUser = async () => {
        const currentUser = await Auth.currentAuthenticatedUser()
        const currentUserEmail = currentUser.attributes.email
        this.setState({ currentUserEmail: currentUserEmail })
    }

    //カートに入っている商品かどうか、お気に入りの商品かどうかを確認
    setFavoritedOrCarted = () => {
        console.log(this.props.navigation.state.params)
        const isFavorited = this.props.navigation.state.params.item.favoriteUser.items?.some(item => item.userId === this.state.currentUserEmail)
        const isCarted = this.props.navigation.state.params.item.status !== 'WAITING'
        this.setState({
            isFavorited: isFavorited,
            isCarted: isCarted
        })
    }

    //カートにアイテムが4つ入っているかを確認
    fetchCartData = async () => {
        const cart = await API.graphql(graphqlOperation(gqlQueries.getCart, { id: this.state.currentUserEmail }))
        const isCartFilled = cart.data.getCart.itemCarts.items.length >= 5
        this.setState({ isCartFilled: isCartFilled })
    }

    //ユーザーがレンタル中かどうかを確認
    fetchIsRental = async () => {
        const user = await API.graphql(graphqlOperation(gqlQueries.getUser, { id: this.state.currentUserEmail }))
        const isRental = user.data.getUser.rental
        this.setState({ isRental: isRental })
    }

    //お気に入りに追加
    saveItemToFavorite = async () => {
        this.setState({ isFavorited: true })
        const { currentUserEmail, item } = this.state
        await API.graphql(graphqlOperation(gqlMutations.createItemFavorite, {
            input: {
                id: currentUserEmail + item["id"],
                itemId: item["id"],
                userId: currentUserEmail
            }
        }))
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
                this.setState({ isCarted: true })
                await this.toggleCartModal()
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
            <FastImage key={idx} source={{ uri: imgUrl }} style={{ width: wp('100%'), height: wp('133%'), resizeMode: 'contain' }}/>
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
                <Modal isVisible={this.state.isCartModalVisible}>
                    <View style={styles.modalContainerView}>
                        <View style={styles.modalInnerView}>
                        <Image source={require('../../assets/taggu-cart.png')} style={styles.tagguImage} />
                            <Text style={styles.modalText}>アイテムをカートに追加しました！</Text>
                            <View style={styles.modalButtonView}>
                                <Button
                                    title='買い物を続ける'
                                    buttonStyle={{ borderRadius: 40, width: wp('30%'), height: hp('7%'), backgroundColor: '#333333' }}
                                    titleStyle={{ fontSize: 14, color: 'white' }}
                                    onPress={() => this.toggleCartModal()}
                                />
                                <Button
                                    title='カートを見る'
                                    buttonStyle={{ marginLeft: wp('3%'), borderRadius: 40, width: wp('27%'), height: hp('7%'), backgroundColor: '#7389D9' }}
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
                <ItemDetailScreen
                    item={item}
                    isFavorited={isFavorited}
                    isRental={isRental}
                    saveItemToFavorite={this.saveItemToFavorite}
                    deleteItemFromFavorite={this.deleteItemFromFavorite}
                />
                <View style={isRental ? styles.isRentalFooterView : styles.footerView }>
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
                            buttonStyle={[styles.cartButtonStyle, { backgroundColor: (isCarted || isCartFilled || isRental) ? 'rgba(115,137,217, 0.65)' : '#7389D9' }]}
                            onPress={isRental ? () => null : (isCarted || isCartFilled) ? () => this.toggleAlertModal() : () => this.saveItemToCart()}
                        />
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: wp('100%'),
        height: hp('100%'),
    },
    innerContainer: {
        width: wp('80%'),
    },
    isRentalFooterView: {
        position: 'absolute',
        bottom: hp('7.5%'),
        width: wp('100%'),
        height: hp('7%'),
    },
    footerView: {
        position: 'absolute',
        bottom: hp('2%'),
        width: wp('100%'),
        height: hp('7%'),
    },
    footerInnerView: {
        alignItems: 'center',
    },
    modalContainerView: {
        backgroundColor: 'white',
        width: wp('70%'),
        height: hp('35%'),
        left: wp('10%'),
        textAlign: 'center',
        borderRadius: 15
    },
    modalInnerView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tagguImage: {
        width: wp('20%'),
        height: hp('20%'),
        resizeMode: 'contain'
    },
    modalText: {
        fontWeight: '400',
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
    },
    cartButtonStyle: {
        borderRadius: 50,
        width: wp('80%'),
        height: hp('7%'),
    }
})
