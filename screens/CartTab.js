import React from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Image, Card, Button } from 'react-native-elements';
import { Auth, API, graphqlOperation } from 'aws-amplify'
import * as gqlQueries from '../src/graphql/queries' // read
import * as gqlMutations from '../src/graphql/mutations' // create, update, delete
import * as gqlSubscriptions from '../src/graphql/subscriptions' // 監視
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

export default class CartTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemCart: [],
            cartSize: 0,
            currentUserEmail: ''
        }
    }

    static navigationOptions = ({navigation}) => ({
        title: 'ボックス',
        headerLeft: () => <Icon name="bars" size={24} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft:20}}/>,
    });

    componentDidMount() {
        //Tab移動時のイベントリスナー(カートに追加したアイテムが反映されないのでここで再度取得)
        this.props.navigation.addListener('didFocus', () => this.fetchItemCart())
    }

    //Cartに入っているアイテムを取得
    fetchItemCart = async () => {
        const currentUser = await Auth.currentAuthenticatedUser()
        const currentUserEmail = currentUser.attributes.email
        try {
            const res = await API.graphql(graphqlOperation(gqlQueries.searchItemCarts, {
                filter: {
                    cartId: {
                        eq: currentUserEmail
                    }
                }
            }))
            console.log(res)
            const itemArray = []
            res.data.searchItemCarts.items.forEach(obj => itemArray.push(obj.item))
            this.setState({
                itemCart: itemArray, cartSize: res.data.searchItemCarts.items.length,
                currentUserEmail: currentUserEmail
            })
        } catch(e) {
            console.log(e);
        }
    }

    //Cartに入っているアイテムを削除
    deleteItemFromCart = async (deleteItem) => {
        const { currentUserEmail } = this.state
        console.log(deleteItem)
        await API.graphql(graphqlOperation(gqlMutations.updateItem, {
            input: {
                id: deleteItem.id,
                status: 'WAITING'
            }
        }))
        const res = await API.graphql(graphqlOperation(gqlMutations.deleteItemCart, {
            input: {
                id: currentUserEmail + deleteItem.id
            }
        }))
        console.log('カートから削除したアイテム')
        console.log(res)
        //削除したアイテムをstateから削除(再レンダリングしなくてもアイテムが消えるように)
        const newArray = this.state.itemCart.filter(ele => !(ele.id === res.data.deleteItemCart.itemId))
        this.setState({itemCart: newArray, cartSize: this.state.cartSize - 1})
    }

    render() {
        //カートにアイテムが4つ入っているか
        const isCartFilled = !!(this.state.cartSize === 4)
        return(
            <View style={styles.container}>
                <FlatList
                    //onRefresh={() => {}}
                    data={this.state.itemCart}
                    style={styles.flatList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.touchableOpacity} onPress={() =>  console.log('test')}>
                            <Card containerStyle={{borderColor: 'white'}} wrapperStyle={{ height: wp('27%')}}>
                                <Card.Image source={{ uri: item.imageURLs[0] }} style={styles.image} />
                                <Card.Title style={styles.brand}>ブランド</Card.Title>
                                <Card.Title style={styles.name}>{item.name}</Card.Title>
                                <Card.Title style={styles.category}>アウター</Card.Title>
                                <Card.Title style={styles.rank}>Sランク</Card.Title>
                                <Icon name='trash-o' size={28} style={styles.trashButton} onPress={() =>  this.deleteItemFromCart(item)} />
                            </Card>
                        </TouchableOpacity>
                    )}
                />
                <View style={styles.rental}>
                    <View style={styles.rentalButtonView}>
                        <Button
                            title='レンタル手続きへ →'
                            buttonStyle={{ borderRadius: 30, width: wp('50%'), height: hp('6%'), backgroundColor: isCartFilled ? 'white' : 'transparent' }}
                            titleStyle={{ color: '#7389D9', fontSize: 16, fontWeight: 'bold' }}
                            onPress={() => console.log('rentaltest')}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E5E5E5'
    },
    flatList: {
        height: hp('80%')
    },
    image: {
        width: wp('27%'),
        height: wp('27%')
    },
    brand: {
        marginTop: -wp('26%'),
        color: '#7389D9',
        fontSize: 12
    },
    name: {
        marginTop: -wp('2%'),
        fontSize: 16
    },
    category: {
        marginTop: -wp('3%'),
        fontSize: 11,
        color: '#828282'
    },
    rank: {
        marginTop: -wp('1%'),
        fontSize: 12,
        backgroundColor: '#C4C4C4',
        color: 'white',
        width: wp('22%'),
        marginLeft: wp('30%')
    },
    trashButton: {
        color: '#7389D9',
        marginLeft: wp('78%'),
        marginTop: -wp('9%')
    },
    rental: {
        height: hp('10%')
    },
    rentalButtonView: {
        position: 'absolute',
        right: wp('5%'),
        bottom: hp('6%'),
        shadowColor: 'black',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        borderRadius: 30,
        width: wp('50%'),
        height: hp('6%')
    }
})
