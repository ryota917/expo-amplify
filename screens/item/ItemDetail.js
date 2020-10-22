import React from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Image, Button } from 'react-native-elements';
import * as gqlQueries from '../../src/graphql/queries'
import * as gqlMutations from '../../src/graphql/mutations'
import ImageSlider from "react-native-image-slider";
import { Auth, API, graphqlOperation } from 'aws-amplify';
import {figmaHp, figmaWp } from '../../src/utils/figmaResponsiveWrapper'

class BookMark extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isBookMarked: this._isBookMarked(),
            bookMarkedIcon: require("./bookmark/black.png"),
            notBookMarkedIcon: require("./bookmark/white.png"),
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
            urls: ["https://amplify-expoamplify-dev-192017-deployment.s3-ap-northeast-1.amazonaws.com/clothes_imgs/etme_0001_wom_skart/etme.jpeg","https://amplify-expoamplify-dev-192017-deployment.s3-ap-northeast-1.amazonaws.com/clothes_imgs/etme_0001_wom_skart/etme2.jpeg"]
        }
    }

    static navigationOptions = ({navigation: { navigate }}) => ({
        headerLeft:() => <Icon name="angle-left" size={28} onPress={()=>{navigate('ItemTab')}} style={{paddingLeft:20, zindex:100}}/>
    });

    componentDidMount() {
        this.props.navigation.addListener('didFocus', () => this.fetchCartData())
    }

    fetchCartData = async () => {
        const currentUser = await Auth.currentAuthenticatedUser()
        const res = await API.graphql(graphqlOperation(gqlQueries.getCart, {id: currentUser.username}))
        console.log(res)
        this.setState({ cartItems: res.data.getCart.itemCarts.items })
    }

    saveItemToCart = async () => {
        const currentUser = await Auth.currentAuthenticatedUser()
        console.log('カートに入れるボタンが押されました')
        //多対多のリレーションは中間テーブルデータの生成で実現可能(item, cartの更新処理は不要)
        await API.graphql(graphqlOperation(gqlMutations.createItemCart, {
            input: {
                id: currentUser.username + this.state.item["id"],
                itemId: this.state.item["id"],
                cartId: currentUser.username
            }
        }))
        //スマホ版専用のアラートなのでWebブラウザのsimulatorではAlertが出ない
        Alert.alert(
            'Button pressed',
            'You did it',
        );
    }

    // handleClick = index => console.log(index)

    render() {
        // debugger;
        // console.table(this.state);
        return(
            <View style={{flex: 1, backgroundColor: "glay"}}>
                <ScrollView  >
                    {/* <Image source={{ uri: this.state.item.image_url }} style={styles.image}></Image> */}
                    <ImageSlider
                        loopBothSide
                        images={this.state.urls}
                        customSlide={({ index, item, style, width }) => (
                            // It's important to put style here because it's got offset inside
                            <View key={index} style={[style, styles.customSlide]}>
                                <Image source={{ uri: item }} style={styles.customImage} onPress={this.handleClick}/>
                            </View>
                        )}
                    />
                    <View style={{flexDirection:"row"}}>
                        <View style={{flexDirection:"column",width:wp.responsive(280)}}>
                            <Text style={styles.brandName}>{"Brand Name"}</Text>
                            <Text style={styles.itemName}>{this.state.item.name}</Text>
                            <Text style={styles.categoryName}>{"カテゴリ"}</Text>
                        </View>
                        <BookMark style={{marginRight:wp.responsive(40)}}/>
                    </View>
                        <View style={{flexDirection: "row",height:hp.responsive("9%"),marginTop:hp.responsive(25)}}>
                        <View style={{flex: 0.1}}></View>
                        <View style={{flex: 0.2, backgroundColor: "red",marginLeft:wp.responsive(41),marginRight:wp.responsive(33)}}></View>
                        <View style={{flex: 0.4, flexDirection:"column",justifyContent:"space-around",marginLeft:wp.responsive("3%")}}>
                            <Text>{"①着丈 000cm"}</Text>
                            <Text>{"②身丈 000cm"}</Text>
                            <Text>{"③袖丈 000cm"}</Text>
                        </View>
                        <View style={{flex: 0.4}}>

                        </View>
                    </View>
                    <View style={{marginTop:hp.responsive(25)}}>
                    {/* <View style={styles.itemState.area}> */}
                        <View style={{flexDirection: "row"}}>
                            <Text style={{fontFamily: "Noto Sans JP", fontSize: 16,marginLeft:41}}>{"状態"}</Text>
                            <View style={{backgroundColor: "gray", marginLeft:wp.responsive(14)}}>
                                <Text style={{color: "white", fontFamily: "Noto Sans JP", fontSize: 16}}>{"Sランク"}</Text>
                            </View>
                        </View>
                        <Text style={{marginLeft:wp.responsive(87), marginTop:hp.responsive(10), width:248, fontFamily: "Noto Sans JP", fontSize: 14}}>{"状態の詳細状態の詳細状態の詳細状態の詳細状態の詳細状態の詳細状態の詳細状態の詳細状態の詳細"}</Text>
                    </View>
                    <View style={{ marginTop:hp.responsive(25)}}>
                        <Text style={{fontFamily: "Noto Sans JP", fontSize: 16,marginLeft:41}}>{"説明"}</Text>
                        <Text style={{marginLeft:wp.responsive(41), marginTop:hp.responsive(10),marginBottom:hp.responsive(51),width:248, fontFamily: "Noto Sans JP", fontSize: 14}}>{"状態の詳細状態の詳細状態の詳細状態の詳細状態の詳細状態の詳細状態の詳細状態の詳細状態の詳細"}</Text>
                    </View>
                </ScrollView>
                <Button color="lavender" icon={<Icon name='shopping-cart' size={30} color="white"/>} title='カートに入れる' onPress={()=>console.log(index)} style={styles.cartButton} color="#7389D9"/>
            </View>
        )
    }
}

const hp = new figmaHp(812);
const wp = new figmaWp(375);

const styles = StyleSheet.create({
    customImage: {
        width: wp.responsive(400),
        height: hp.responsive(512),
        // overflow: 'hidden'
    },
    customSlide: {
        backgroundColor: 'gray',
        alignItems: 'center',
        justifyContent: 'center',
        height: hp.responsive("63%"),
    },
    brandName: {
        height: 23,
        left: 41,
        marginTop: hp.responsive("3.8%"),
        marginLeft: wp.responsive("11%"),
        fontFamily: "Arial",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 20,
        lineHeight: 23,
        display: "flex",
        alignItems: "flex-end",

        color: "#7389D9",
    },
    itemName: {
        height: 26,
        marginTop: hp.responsive("0.6%"),
        marginLeft: wp.responsive("11%"),
        fontFamily: "Noto Sans JP",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 18,
        lineHeight: 26,
        color: "#333333",
    },
    itemState:{
        area:{
            height: hp.responsive(145),
            backgroundColor: "black"

        },
    },
    categoryName:{
        marginTop: hp.responsive(15),
        fontWeight: 400,
        fontFamily: "Noto Sans JP",
        fontSize: 11,
        marginLeft: wp.responsive(43),
    },
    cartButton: {
        marginLeft: wp.responsive(40),
        marginBottom: hp.responsive(51),
        color: "#7389D9",
        width: wp.responsive(281),
        height: wp.responsive(55),
        borderRadius: 28,
    }
})
