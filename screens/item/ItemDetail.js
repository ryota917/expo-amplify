import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Image, Button } from 'react-native-elements';
import * as gqlQueries from '../../src/graphql/queries'
import * as gqlMutations from '../../src/graphql/mutations'
import { Auth, API, graphqlOperation } from 'aws-amplify';

export default class ItemDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: this.props.navigation.state.params.item,
            cartItems: []
        }
    }

    static navigationOptions = ({navigation: { navigate }}) => ({
        title: 'アイテム詳細画面',
        headerLeft:() => <Icon name="angle-left" size={28} onPress={()=>{navigate('ItemTab')}} style={{paddingLeft:20}}/>
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

    render() {
        return(
            <View>
                <Image source={{ uri: this.state.item.image_url }} style={styles.image}></Image>
                <Text>{this.state.item.name}</Text>
                <Button icon={<Icon name='shopping-cart' size={30} color='white'/>} title='カートに入れる' onPress={this.saveItemToCart}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    image: {
        width: 400,
        height: 400,
        overflow: 'hidden'
    }
})
