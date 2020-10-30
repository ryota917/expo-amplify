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
        headerLeft:() => <Icon name="angle-left" size={28} onPress={()=>{navigate('CartTab')}} style={{paddingLeft:20}}/>
    });

    componentDidMount() {
        this.props.navigation.addListener('didFocus', () => this.fetchCartData())
    }

    fetchCartData = async () => {
        const currentUser = await Auth.currentAuthenticatedUser()
        const currentUserEmail = currentUser.attributes.email
        const res = await API.graphql(graphqlOperation(gqlQueries.getCart, {id: currentUserEmail}))
        console.log(res)
        this.setState({
            cartItems: res.data.getCart.itemCarts.items,
            currentUserEmail: currentUserEmail
        })
    }

    render() {
        return(
            <View>
                <Image source={{ uri: this.state.item.imageURLs[0] }} style={styles.image}></Image>
                <Text>{this.state.item.name}</Text>
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
