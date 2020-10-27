import React from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Image, Button } from 'react-native-elements';
import * as gqlQueries from '../../src/graphql/queries'
import * as gqlMutations from '../../src/graphql/mutations'
import { Auth, API, graphqlOperation } from 'aws-amplify';
import {figmaHp, figmaWp } from '../../src/utils/figmaResponsiveWrapper'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Swiper from 'react-native-swiper'

export default class ItemDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: this.props.navigation.state.params.item,
            cartItems: [],
            currentUserEmail: ''
        }
    }

    static navigationOptions = ({navigation: { navigate }}) => ({
        headerLeft:() => <Icon name="angle-left" size={28} onPress={()=>{navigate('ItemTab')}} style={{paddingLeft:20, zindex:100}}/>
    });

    componentDidMount() {
        this.props.navigation.addListener('didFocus', () => {
            this.fetchCartData()
            console.log(this.state.item)
        })
    }

    fetchCartData = async () => {
        const currentUser = await Auth.currentAuthenticatedUser()
        const currentUserEmail = currentUser.attributes.email
        console.log(currentUser)
        const res = await API.graphql(graphqlOperation(gqlQueries.getCart, {id: currentUserEmail }))
        console.log(res)
        this.setState({
            cartItems: res.data.getCart.itemCarts.items,
            currentUserEmail: currentUserEmail
        })
    }

    saveItemToCart = async () => {
        const { currentUserEmail, item } = this.state
        console.log('カートに入れるボタンが押されました')
        //多対多のリレーションは中間テーブルデータの生成で実現可能(item, cartの更新処理は不要)
        await API.graphql(graphqlOperation(gqlMutations.createItemCart, {
            input: {
                id: currentUserEmail + this.state.item["id"],
                itemId: item["id"],
                cartId: currentUserEmail
            }
        }))
        await API.graphql(graphqlOperation(gqlMutations.updateItem, {
            input: {
                id: item["id"],
                status: 'CARTING'
            }
        }))
        //スマホ版専用のアラートなのでWebブラウザのsimulatorではAlertが出ない
        Alert.alert(
            'Button pressed',
            'You did it',
        );
    }

    saveItemToFavorite = async () => {
        const { currentUserEmail, item } = this.state
        console.log('お気に入りボタンが押されました')
        await API.graphql(graphqlOperation(gqlMutations.createItemFavorite, {
            input: {
                id: currentUserEmail + item["id"],
                itemId: item["id"],
                userId: currentUserEmail
            }
        }))
        Alert.alert(
            'Favorite added!',
        )
    }

    render() {
        const { item } = this.state
        const imagesDom = item.imageUrls.map((imgUrl, idx) =>
            <Image key={idx} source={{ uri: imgUrl }} style={{ width: wp('100%'), height: wp('100%') }}/>
        )
        return(
            <View style={styles.container}>
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
                                        <Text style={styles.categoryText}>{item.bigCategory}</Text>
                                    </View>
                                </View>
                                <View style={styles.iconView}>
                                    {/* bookmark-minus-outline */}
                                    <Icon name='bookmark-minus' size={40}/>
                                </View>
                            </View>
                            {/* サイズ */}
                            <View style={styles.sizeView}>
                                <Image source={require('../..//assets/vector.png')} style={{ width: wp('30%'), height: wp('30%'), resizeMode: 'contain' }} />
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
                            <View style={{ height: hp('10%') }}></View>
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.footerView}>
                    <View style={styles.footerInnerView}>
                        <Button
                            icon={
                                <Icon name='cart' size={20} style={{ color: 'white', marginRight: wp('4%') }}  />
                            }
                            title="カートに入れる"
                            titleStyle='white'
                            buttonStyle={{ backgroundColor: '#7389D9', borderRadius: 23, width: wp('80%'), height: hp('7%') }}
                        />
                    </View>
                </View>
            </View>
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
        marginLeft: wp('50%'),
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
        marginTop: hp('2%')
    },
    descriptionTitleText: {
        fontSize: 18
    },
    descriptionText: {
        marginTop: hp('2%')
    },
    footerView: {
        height: hp('20%'),
        bottom: hp('7%')
    },
    footerInnerView: {
        flex: 1,
        alignItems: 'center'
    }
})
