import React from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Image, Button } from 'react-native-elements';
import * as gqlQueries from '../../src/graphql/queries'
import * as gqlMutations from '../../src/graphql/mutations'
import ImageSlider from "react-native-image-slider";
import { Auth, API, graphqlOperation } from 'aws-amplify';
import {figmaHp, figmaWp } from '../../src/utils/figmaResponsiveWrapper'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

class BookMark extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isBookMarked: this._isBookMarked(),
            currentUserEmail: ''
            // TODO: ブックマークアイコンの画像の読み込み
        }
    }

    _isBookMarked = itemId => {
        // TODO: itemIdからユーザーがブックマークしているかどうかを判別
        return true
    }

    _iconName = () => {
        return this.state.isBookMarked ? this.state.bookMarkedIcon : this.state.notBookMarkedIcon
    }

    handleClick = () => {
        this.setState((state)=>({isBookMarked : !state.isBookMarked}));
    }

    render(){
        return(
            <View>
                <Icon name={this._iconName()} size={34} style={{marginTop: hp.responsive(49)}}/>
            </View>
        )
    }
}

export default class ItemDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: this.props.navigation.state.params.item,
            urls: ["https://amplify-expoamplify-dev-192017-deployment.s3-ap-northeast-1.amazonaws.com/clothes_imgs/etme_0001_wom_skart/etme.jpeg","https://amplify-expoamplify-dev-192017-deployment.s3-ap-northeast-1.amazonaws.com/clothes_imgs/etme_0001_wom_skart/etme2.jpeg"],
            currentUserEmail: ''
        }
    }

    static navigationOptions = ({navigation: { navigate }}) => ({
        headerLeft:() => <Icon name="angle-left" size={28} onPress={()=>{navigate('ItemTab')}} style={{paddingLeft:20, zindex:100}}/>
    });

    componentDidMount() {
        this.props.navigation.addListener('didFocus', () => {
            this.fetchCartData()
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
        return(
            <View style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.innerContainer}>
                        <View style={styles.imagesView}>
                            <Image />
                        </View>
                        <View style={styles.titleView}>
                            <View style={styles.brandView}>
                                <Text style={styles.brandText}>ブランド名</Text>
                            </View>
                            <View style={styles.nameView}>
                                <Text style={styles.nameText}>アイテム名</Text>
                            </View>
                            <View style={styles.categoryView}>
                                <Text style={styles.categoryText}>カテゴリ</Text>
                            </View>
                            <Icon name='search'/>
                        </View>
                        <View style={styles.sizeView}>
                            <View style={styles.sizePictureView}>
                                {/* <Image/> */}
                            </View>
                            <View style={styles.sizeTextView}>
                                <Text style={styles.sizeText}>①着丈 00cm</Text>
                                <Text style={styles.sizeText}>②身幅 99cm</Text>
                                <Text style={styles.sizeText}>③袖幅 002cm</Text>
                            </View>
                        </View>
                        <View style={styles.stateView}>
                            <Text style={styles.stateTitleText}>状態</Text>
                            <Text style={styles.stateRankText}>Sランク</Text>
                            <Text style={styles.stateDescriptionText}>商品の状態説明が入りますううううううううううううううううううううううううううううううう</Text>
                        </View>
                        <View style={styles.descriptionView}>
                            <Text style={styles.descriptionTitleText}>説明</Text>
                            <Text style={styles.descriptionText}>アイテムの説明が入りますすすうううううううううううううううううううううううううううう</Text>
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.footerView}>
                    <View style={styles.footerInnerView}>
                        <Button
                            icon={
                                <Icon name='search' size={15} style={{ color: 'white' }}  />
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
        width: wp('80%'),
        alignItems: 'center'
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
