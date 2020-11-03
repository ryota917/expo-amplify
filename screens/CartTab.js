import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Image, Card, Button } from 'react-native-elements';
import { Auth, API, graphqlOperation } from 'aws-amplify'
import * as gqlQueries from '../src/graphql/queries' // read
import * as gqlMutations from '../src/graphql/mutations' // create, update, delete
import * as gqlSubscriptions from '../src/graphql/subscriptions' // 監視
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import send_message from '../src/messaging/slack'

export default class CartTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemCart: [],
            currentUserEmail: '',
            isCartFilled: false
        }
    }

    static navigationOptions = ({navigation}) => ({
        headerTitle: () => (
            <Image source={require('../assets/pretapo-logo-header.png')} style={{ resizeMode: 'contain', width: wp('25%'), height: hp('10%') }}/>
        ),
        headerLeft: () => <Icon name="bars" size={24} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft: 20}}/>
    });

    componentDidMount = async () => {
        await this.fetchCurrentUser()
        this.fetchItemCart()
        //Tab移動時のイベントリスナー(カートに追加したアイテムが反映されないのでここで再度取得)
        this.props.navigation.addListener('didFocus', async () => {
            await this.fetchCurrentUser()
            await this.fetchItemCart()
        })
    }

    fetchCurrentUser = async () => {
        const currentUser = await Auth.currentAuthenticatedUser()
        const currentUserEmail = currentUser.attributes.email
        this.setState({ currentUserEmail: currentUserEmail })
    }

    //Cartに入っているアイテムを取得
    fetchItemCart = async () => {
        try {
            const res = await API.graphql(graphqlOperation(gqlQueries.searchItemCarts, {
                filter: {
                    cartId: {
                        eq: this.state.currentUserEmail
                    }
                }
            }))
            const itemArray = []
            res.data.searchItemCarts.items.forEach(obj => itemArray.push(obj.item))
            const isCartFilled = res.data.searchItemCarts.items.length >= 4
            this.setState({
                itemCart: itemArray,
                isCartFilled: isCartFilled
            })
        } catch(e) {
            console.log(e);
        }
    }

    //Cartに入っているアイテムを削除
    deleteItemFromCart = async (deleteItem) => {
        const { currentUserEmail } = this.state
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
        //削除したアイテムをstateから削除(再レンダリングしなくてもアイテムが消えるように)
        const newArray = this.state.itemCart.filter(ele => !(ele.id === res.data.deleteItemCart.itemId))
        const isCartFilled = newArray.length >= 4
        this.setState({
            itemCart: newArray,
            isCartFilled: isCartFilled
        })
    }

    navigateConfirmPage = () => {
        this.props.navigation.navigate('ConfirmPage', { itemCart: this.state.itemCart })
    }

    render() {
        const { isCartFilled } = this.state
        return(
            <View style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    {this.state.itemCart.map((item, i) =>
                        <View style={styles.cardContainer} key={i}>
                            <Card wrapperStyle={{ height: wp('27%')}}>
                                <Card.Image
                                    source={{ uri: item.imageURLs[0] }}
                                    style={styles.image}
                                    onPress={() => this.props.navigation.navigate('CartItemDetail', { item: item })}
                                />
                                <Card.Title style={styles.brand} onPress={() => this.props.navigation.navigate('CartItemDetail', { item: item })}>ブランド</Card.Title>
                                <Card.Title style={styles.name} onPress={() => this.props.navigation.navigate('CartItemDetail', { item: item })}>{item.name}</Card.Title>
                                <Card.Title style={styles.category} onPress={() => this.props.navigation.navigate('CartItemDetail', { item: item })}>アウター</Card.Title>
                                <Card.Title style={styles.rank} onPress={() => this.props.navigation.navigate('CartItemDetail', { item: item })}>Sランク</Card.Title>
                                <Icon name='trash-o' size={28} style={styles.trashButton} onPress={() =>  this.deleteItemFromCart(item)} />
                            </Card>
                        </View>
                    )}
                    <View style={{ height: hp('34%') }}></View>
                </ScrollView>
                <View style={styles.rentalButtonView}>
                    <Button
                        title='レンタル手続きへ →'
                        buttonStyle={[styles.rentalButtonStyle, { backgroundColor: isCartFilled ? 'white': 'rgba(255,255,255,0.5)' }]}
                        titleStyle={styles.rentalTitleStyle}
                        onPress={isCartFilled ? () => this.navigateConfirmPage() : () => null}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: wp('100%'),
        height: hp('100%'),
    },
    scrollView: {
    },
    cardContainer: {
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
    rentalButtonView: {
        position: 'absolute',
        right: wp('6%'),
        bottom: hp('20%'),
        backgroundColor: 'transparent',
        shadowColor: 'black',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 20
    },
    rentalButtonStyle: {
        borderRadius: 30,
        width: wp('50%'),
        height: hp('7%'),
    },
    rentalTitleStyle: {
        color: '#7389D9',
        fontSize: 16,
        fontWeight: 'bold'
    }
})
