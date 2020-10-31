import React from 'react';
import { StyleSheet, Image, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import * as gqlQueries from '../src/graphql/queries' // read
import * as gqlMutations from '../src/graphql/mutations' // create, update, delete
import { Card } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

export default class ItemTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchCondition: [{color: ''}, {bigCategory: ''}, {size: ''}, {rank: ''}],
            items: [],
            nextToken: '',
            canLoad: true,
            isLoading: false,
            isRefreshing: false,
        }
    }

    static navigationOptions = ({navigation}) => {
        const { params } = navigation.state
        return {
                headerTitle: () => (
                <Image source={require('../assets/pretapo-logo-header.png')} style={{ resizeMode: 'contain', width: wp('25%'), height: hp('10%') }}/>
            ),
            headerLeft: () => <Icon name="bars" size={24} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft: 20}}/>,
            headerRight:() => <Icon name='search' size={24} onPress={() => {navigation.navigate('SearchConditionModal', { searchCondition: params.searchCondition } )}} style={{paddingRight: 20}}/>
        }
    };

    componentDidMount = async () => {
        this.syncUserAndCartToDynamo();
        this.initialLoad()
        //navigationのイベントリスナーでTabが押された時に毎回アイテム情報を取得する
        //FIX ME: addListenerが複数回レンダリングされている
        await this.props.navigation.addListener('didFocus', async () => {
            //stateが更新されるのとawaitしないと前のstateで表示される
            await this.updateSearchState()
            this.initialLoad()
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
        //検索画面へ渡す検索条件パラメータをセット
        this.props.navigation.setParams({ searchCondition: this.state.searchCondition })
    }

    loadQuery = () => {
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
                    limit: 30,
                    nextToken: this.state.nextToken
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
                    limit: 30,
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
                                    eq: condition[0][key21]
                                }
                            },
                            [key22]: {
                                eq: condition[1][key22]
                            }
                        },
                        status: {
                            eq: 'WAITING'
                        }
                    },
                    limit: 30,
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
                    limit: 30,
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

    initialQuery = () => {
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
                    limit: 30,
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
                    limit: 30,
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
                                    eq: condition[0][key21]
                                }
                            },
                            [key22]: {
                                eq: condition[1][key22]
                            }
                        },
                        status: {
                            eq: 'WAITING'
                        }
                    },
                    limit: 30,
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
                    limit: 30
                }
                break;
            case 0:
                return {
                    filter: {
                        status: {
                            eq: 'WAITING'
                        }
                    },
                    limit: 30
                }
        }
    }

    initialLoad = async () => {
        console.log('初期ローディング')
        this.setState({ isLoading: true })
        const query = await this.initialQuery()
        const res = await API.graphql(graphqlOperation(gqlQueries.searchItems, query))
        const canLoad = !!(res.data.searchItems.nextToken)
        this.setState({
            items: res.data.searchItems.items,
            nextToken: res.data.searchItems.nextToken,
            canLoad: canLoad,
            isLoading: false
        })
    }

    continueLoading = async () => {
        console.log('追加ローディング')
        this.setState({ isLoading: true })
        const query = await this.loadQuery()
        const res = await API.graphql(graphqlOperation(gqlQueries.searchItems, query))
        console.log(res.data.searchItems.nextToken)
        const canLoad = !!(res.data.searchItems.nextToken)
        console.log(canLoad)
        this.setState(prevState => ({
            items: prevState.items.concat(res.data.searchItems.items),
            nextToken: res.data.searchItems.nextToken,
            canLoad: canLoad,
            isLoading: false
        }))
    }

    onRefresh = async () => {
        this.setState({ isRefreshing: true })
        await this.initialLoad()
        this.setState({ isRefreshing: false })
    }

    render() {
        const activityIndicator = <ActivityIndicator size='large' />
        const { canLoad, items, isLoading, isRefreshing } = this.state
        return (
            <FlatList
                refreshing={isRefreshing}
                onRefresh={() => this.onRefresh()}
                data={items}
                numColumns={3}
                columnWrapperStyle={styles.columnWrapperStyle}
                renderItem={({ item }) => (
                    <Card
                        containerStyle={styles.cardContainer}
                        wrapperStyle={styles.cardWrapper}
                    >
                        <Card.Image
                            source={{ uri: item.imageURLs[0] }}
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
                )}
                onEndReached={(canLoad && !isLoading) ? () => this.continueLoading() : () => null}
                onEndReachedThreshold={1}
                ListFooterComponent={canLoad ? activityIndicator : null}
                ListFooterComponentStyle={{ marginTop : hp('2%') }}
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
