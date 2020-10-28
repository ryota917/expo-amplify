import React from 'react';
import { View, StyleSheet, Text, ScrollView, SafeAreaView, Image, FlatList, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import * as gqlQueries from '../src/graphql/queries' // read
import * as gqlMutations from '../src/graphql/mutations' // create, update, delete
import { ListItem, Card, Button } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

const RENTAL_NUM = 4
const ITEMS_PER_PAGE = 50
const ITEM_WIDTH = Dimensions.get('window').width;

export default class ItemTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchCondition: [{color: ''}, {category: ''}, {size: ''}, {rank: ''}],
            items: [],
            nextToken: '',
            canLoad: true,
            isLoading: false
        }
    }

    static navigationOptions = ({navigation}) => ({
        headerTitle: () => (
            <Image source={{ uri: 'https://prepota-bucket.s3-ap-northeast-1.amazonaws.com/logo-white.png'}} style={{ height: 30, paddingLeft: 210, paddingTop: 13, resizeMode: 'contain' }}/>
        ),
        headerLeft: () => <Icon name="bars" size={24} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft: 20}}/>,
        headerRight:() => <Icon name='search' size={24} onPress={() => {navigation.navigate('SearchConditionModal')}} style={{paddingRight: 20}}/>
    });

    componentDidMount = async () => {
        this.syncUserAndCartToDynamo();
        this.flatLoad()
        //navigationのイベントリスナーでTabが押された時に毎回アイテム情報を取得する
        await this.props.navigation.addListener('didFocus', async () => {
            //stateが更新されるのとawaitしないと前のstateで表示される
            await this.updateSearchState()
            this.flatLoad()
        })
    }

    //暫定対応
    syncUserAndCartToDynamo = async () => {
        const currentUser = await Auth.currentAuthenticatedUser()
        const currentUserEmail = currentUser.attributes.email
        const dynamoUser = await API.graphql(graphqlOperation(gqlQueries.getUser, {id: currentUserEmail}))
        const dynamoCart = await API.graphql(graphqlOperation(gqlQueries.getCart, {id: currentUserEmail}))
        if(!dynamoUser.data.getUser) {
            console.log('新規ユーザーデータを作成します')
            await API.graphql(graphqlOperation(gqlMutations.createUser, {
                input: {
                    id: currentUserEmail,
                    cartId: currentUserEmail,
                    name: 'name',
                    nameKana: 'fdf',
                    phoneNumber: 'dff',
                    address: 'dfasdf',
                    postalCode: 'fdsa',
                    height: 'dfafs',
                    birthday: 'dfas',
                    gender: 'afsdf'
                }
            }))
        }
        if(!dynamoCart.data.getCart) {
            console.log('新規ユーザーのカートデータを作成します')
            await API.graphql(graphqlOperation(gqlMutations.createCart, {
                input: {
                    id: currentUserEmail,
                    userId: currentUserEmail
                }
            }))
        }
    }
    //検索条件を更新
    updateSearchState = () => {
        //検索画面から検索条件を取得
        if(this.props.navigation.state.params?.searchCondition) {
            this.setState({ searchCondition: this.props.navigation.state.params?.searchCondition })
        }
    }

    loadSearchQuery = () => {
        const condition = this.state.searchCondition.filter(ele => Object.values(ele)[0].length )
        const limitNum = condition.length
        switch(limitNum) {
            case 4:
                const key41 = Object.keys(condition[0])
                const key42 = Object.keys(condition[1])
                const key43 = Object.keys(condition[2])
                const key44 = Object.keys(condition[3])
                return {
                    filter: {
                        and: {
                            and: {
                                and: {
                                    and: {
                                        [key41]: {
                                            eq: condition[0][key41]
                                        }
                                    },
                                    [key42]: {
                                        eq: condition[1][key42]
                                    }
                                },
                                [key43]: {
                                    eq: condition[2][key43]
                                }
                            },
                            [key44]: {
                                eq: condition[3][key44]
                            }
                        },
                        status: {
                            eq: 'WAITING'
                        }
                    },
                    limit: 9,
                    nextTokeN: this.state.nextToken
                }
            case 3:
                const key31 = Object.keys(condition[0])
                const key32 = Object.keys(condition[1])
                const key33 = Object.keys(condition[2])
                return {
                    filter: {
                        and: {
                            and: {
                                and: {
                                    [key31]: {
                                        eq: condition[0][key31]
                                    }
                                },
                                [key32]: {
                                    eq: condition[1][key32]
                                }
                            },
                            [key33]: {
                                eq: condition[2][key33]
                            }
                        },
                        status: {
                            eq: 'WAITING'
                        }
                    },
                    limit: 9,
                    nextToken: this.state.nextToken
                }
                break;
            case 2:
                const key21 = Object.keys(condition[0])
                const key22 = Object.keys(condition[1])
                return {
                    filter: {
                        and: {
                            and: {
                                [key21]: {
                                    eq: condition[0][key1]
                                }
                            },
                            [key22]: {
                                eq: condition[1][key2]
                            }
                        },
                        status: {
                            eq: 'WAITING'
                        }
                    },
                    limit: 9,
                    nextToken: this.state.nextToken
                }
                break;
            case 1:
                const key = Object.keys(condition[0])
                return{
                    filter: {
                        and: {
                            [key]: {
                                eq: condition[0][key]
                            },
                            status: {
                                eq: 'WAITING'
                            }
                        }
                    },
                    limit: 9,
                    nextToken: this.state.nextToken
                }
                break;
            case 0:
                return {
                    filter: {
                        status: {
                            eq: 'WAITING'
                        }
                    },
                    limit: 10,
                    nextToken: this.state.nextToken
                }
        }
    }

    fetchSearchQuery = () => {
        const condition = this.state.searchCondition.filter(ele => Object.values(ele)[0].length )
        const limitNum = condition.length
        switch(limitNum) {
            case 4:
                const key41 = Object.keys(condition[0])
                const key42 = Object.keys(condition[1])
                const key43 = Object.keys(condition[2])
                const key44 = Object.keys(condition[3])
                return {
                    filter: {
                        and: {
                            and: {
                                and: {
                                    and: {
                                        [key41]: {
                                            eq: condition[0][key41]
                                        }
                                    },
                                    [key42]: {
                                        eq: condition[1][key42]
                                    }
                                },
                                [key43]: {
                                    eq: condition[2][key43]
                                }
                            },
                            [key44]: {
                                eq: condition[3][key44]
                            }
                        },
                        status: {
                            eq: 'WAITING'
                        }
                    },
                    limit: 9,
                }
            case 3:
                const key31 = Object.keys(condition[0])
                const key32 = Object.keys(condition[1])
                const key33 = Object.keys(condition[2])
                return {
                    filter: {
                        and: {
                            and: {
                                and: {
                                    [key31]: {
                                        eq: condition[0][key31]
                                    }
                                },
                                [key32]: {
                                    eq: condition[1][key32]
                                }
                            },
                            [key33]: {
                                eq: condition[2][key33]
                            }
                        },
                        status: {
                            eq: 'WAITING'
                        }
                    },
                    limit: 9,
                }
                break;
            case 2:
                const key21 = Object.keys(condition[0])
                const key22 = Object.keys(condition[1])
                return {
                    filter: {
                        and: {
                            and: {
                                [key21]: {
                                    eq: condition[0][key1]
                                }
                            },
                            [key22]: {
                                eq: condition[1][key2]
                            }
                        },
                        status: {
                            eq: 'WAITING'
                        }
                    },
                    limit: 9,
                }
                break;
            case 1:
                const key = Object.keys(condition[0])
                return{
                    filter: {
                        and: {
                            [key]: {
                                eq: condition[0][key]
                            },
                            status: {
                                eq: 'WAITING'
                            }
                        }
                    },
                    limit: 9
                }
                break;
            case 0:
                return {
                    filter: {
                        status: {
                            eq: 'WAITING'
                        }
                    },
                    limit: 9
                }
        }
    }

    flatLoad = async () => {
        console.log('初期ローディング開始')
        const query = await this.fetchSearchQuery()
        const res = await API.graphql(graphqlOperation(gqlQueries.searchItems, query))
        const canLoad = !!(res.data.searchItems.nextToken)
        await this.setState({
            items: res.data.searchItems.items,
            nextToken: res.data.searchItems.nextToken,
            canLoad: canLoad
        })
    }

    startLoading = async () => {
        console.log('ローディング開始')
        this.setState({ isLoading: true })
        const query = this.loadSearchQuery()
        const res = await API.graphql(graphqlOperation(gqlQueries.searchItems, query))
        const canLoad = !!(res.data.searchItems.nextToken)
        await this.setState(prevState => ({
            items: prevState.items.concat(res.data.searchItems.items),
            nextToken: res.data.searchItems.nextToken,
            canLoad: canLoad,
            isLoading: false
        }))
    }

    render() {
        const activityIndicator = <ActivityIndicator animating size='large'/>
        const { canLoad, items, isLoading } = this.state
        return (
            <FlatList
                //onRefresh={() => {}}
                data={items}
                numColumns={3}
                columnWrapperStyle={styles.columnWrapperStyle}
                renderItem={({ item }) => (
                    // <TouchableOpacity onPress={() => this.props.navigation.navigate('ItemDetail', { item: item })} style={styles.touchableOpacity} >
                        // <View style={styles.itemView} >
                            <Card
                                containerStyle={styles.cardContainer}
                                wrapperStyle={styles.cardWrapper}
                                onPress={() => this.props.navigation.navigate('ItemDetail', { item: item })}
                            >
                                <Card.Image
                                    source={{ uri: item.imageUrls[0] }}
                                    style={styles.itemImage}
                                    onPress={() => this.props.navigation.navigate('ItemDetail', { item: item })}
                                />
                                <Card.Title
                                    style={styles.itemText}
                                    onPress={() => this.props.navigation.navigate('ItemDetail', { item: item })}
                                >
                                    {item.name}
                                </Card.Title>
                            </Card>
                        // </View>
                    // </TouchableOpacity>
                )}
                onEndReached={(canLoad && !isLoading) ? this.startLoading : null}
                onEndReachedThreshold={1}
                ListFooterComponent={canLoad ? activityIndicator : null}
            />
        );
    }
}

const styles = StyleSheet.create({
    columnWrapperStyle: {
        margin: 1,
    },
    cardContainer: {
        padding: 0,
        margin: 0,
        width: wp('33%'),
    },
    itemImage: {
        width: wp('33%'),
        height: hp('20%'),
    },
    itemText: {
        width: wp('32%'),
        height: hp('5%'),
        fontSize: 12
    }
})
