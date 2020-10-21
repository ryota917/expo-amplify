import React from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Image, Card, Button } from 'react-native-elements';
import { Auth, API, graphqlOperation } from 'aws-amplify'
import * as gqlQueries from '../src/graphql/queries' // read
import * as gqlMutations from '../src/graphql/mutations' // create, update, delete
import * as gqlSubscriptions from '../src/graphql/subscriptions' // 監視
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Fab from '@material-ui/core/Fab'

export default class CartTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemCart: []
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
        try {
            const res = await API.graphql(graphqlOperation(gqlQueries.searchItemCarts, {
                filter: {
                    cartId: {
                        eq: currentUser.username
                    }
                }
            }))
            console.log(res)
            const itemArray = []
            res.data.searchItemCarts.items.forEach(obj => itemArray.push(obj.item))
            this.setState({itemCart: itemArray})
        } catch(e) {
            console.log(e);
        }
    }

    //Cartに入っているアイテムを削除
    deleteItemFromCart = async (ele) => {
        const currentUser = await Auth.currentAuthenticatedUser()
        const res = await API.graphql(graphqlOperation(gqlMutations.deleteItemCart, {
            input: {
                id: currentUser.username + ele.id
            }
        }))
        console.log('カートから削除したアイテム情報 '+ res)
        //削除したアイテムをstateから削除(再レンダリングしなくてもアイテムが消えるように)
        const newArray = this.state.itemCart.filter(ele => !(ele.id === res.data.deleteItemCart.itemId))
        this.setState({itemCart: newArray})
    }

    render() {
        return(
            <View style={styles.container}>
                <FlatList
                    //onRefresh={() => {}}
                    data={this.state.itemCart}
                    style={styles.flatList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.touchableOpacity} onPress={() => console.log(item)}>
                            <Card containerStyle={{borderColor: 'white'}} wrapperStyle={{ height: wp('27%')}}>
                                <Card.Image source={{ uri: item.image_url }} style={styles.image} />
                                <Card.Title style={styles.brand}>ブランド</Card.Title>
                                <Card.Title style={styles.name}>{item.name}</Card.Title>
                                <Card.Title style={styles.category}>アウター</Card.Title>
                                <Card.Title style={styles.rank}>Sランク</Card.Title>
                                <Icon name='trash-o' size={28} style={styles.trashButton} onPress={this.deleteItemFromCart} />
                            </Card>
                        </TouchableOpacity>
                    )}
                />
                <View style={styles.rentalButtonView}>
                    <Fab variant='extended'>
                        <Button
                            title='レンタル手続きへ→'
                            buttonStyle={{ backgroundColor: 'transparent' }}
                            titleStyle={{ color: '#7389D9', fontSize: 18 }}
                            onPress={this.searchWithCondition}
                        />
                    </Fab>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
    },
    flatList: {
    },
    touchableOpacity: {
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
        marginTop: -wp('9%'),
    },
    rentalButtonView: {
        width: wp('50%'),
        marginLeft: wp('45%'),
        marginTop: wp('10%')
    }
})
