import React from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Image, Button } from 'react-native-elements';
import * as gqlQueries from '../../src/graphql/queries'
import * as gqlMutations from '../../src/graphql/mutations'
import ImageSlider from "react-native-image-slider";
import * as gqlMutations from '../../src/graphql/mutations';
import { Auth, API, graphqlOperation } from 'aws-amplify';

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

    handleClick = index => console.log(index)

    render() {
        // debugger;
        // console.table(this.state);
        return(
            <View>
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
                    <Text style={styles.brandName}>{"Brand Name"}</Text>
                    <Text style={styles.itemName}>{this.state.item.name}</Text>
                    {/* 身丈，着丈，袖丈ってどうやって表現したらいい？ */}
                    {/* importの{}の意味 */}
                    <Text>{"状態"}</Text>
                    <Text>{"説明"}</Text>
                    <Text>{"説明"}</Text>
                    <Text>{"他のアイテム"}</Text>
                </ScrollView>
                <Button color="lavender" icon={<Icon name='shopping-cart' size={30} color="white"/>} title='カートに入れる' onPress={()=>console.log(index)} style={styles.cartButton}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    customImage: {
        width: 400,
        height: 512,
        // overflow: 'hidden'
    },
    customSlide: {
        backgroundColor: 'gray',
        alignItems: 'center',
        justifyContent: 'center',
    },
    brandName: {
        // position: "absolute",
        // width: 95,
        height: 23,
        left: 41,
        top: 587,

        fontFamily: "Arial",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 20,
        lineHeight: 23,
        /* identical to box height */

        display: "flex",
        alignItems: "flex-end",

        color: "#7389D9",
    },
    itemName: {
        // position: "absolute",
        // width: "162px",
        height: 26,
        left: 41,
        top: 615,
        fontFamily: "Noto Sans JP",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "18px",
        lineHeight: "26px",
        /* identical to box height */

        display: "flex",
        alignItems: "flex-end",

        color: "#333333",
    },
    cartButton: {
        // position: "absolute",
        width: 281,
        height: 55,
        // left: 23,
        // borderRadius: 27,
        // top: 1283,
    }
})
