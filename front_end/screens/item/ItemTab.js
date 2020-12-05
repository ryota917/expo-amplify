import React from 'react';
import { Platform, StyleSheet, Image, View, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import * as gqlQueries from '../../../src/graphql/queries' // read
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Item from './Item'

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
                <Image source={require('../../../assets/pretapo-logo-header.png')} style={styles.logoImage}/>
            ),
            headerLeft: () => <Icon name="bars" size={Platform.isPad ? 40 : 28} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft: 20}}/>,
            headerRight:() => <Icon name='search' size={Platform.isPad ? 40 : 28} onPress={() => {navigation.navigate('SearchConditionModal', { searchCondition: params.searchCondition } )}} style={{paddingRight: 20}}/>,
            headerStyle: {
                height: hp('7%')
            }
        }
    };

    componentDidMount = async () => {
        this.initialLoad()
        //navigationのイベントリスナーでTabが押された時に毎回アイテム情報を取得する
        await this.props.navigation.addListener('didFocus', async () => {
            //awaitしないと前のstateで表示される
            await this.updateSearchState()
            this.initialLoad()
        })
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
                    limit: 30,
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
                    limit: 30,
                }
                break;
            case 0:
                return {
                    filter: {
                        status: {
                            eq: 'WAITING'
                        }
                    },
                    limit: 30,
                }
        }
    }

    initialLoad = async () => {
        console.log('アイテム一覧初期ロード')
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
        console.log('アイテム一覧追加ローディング')
        this.setState({ isLoading: true })
        const query = await this.loadQuery()
        const res = await API.graphql(graphqlOperation(gqlQueries.searchItems, query))
        //You have a large list that is slow to update - make sure your renderItem function renders components that follow React performance best practices like PureComponent, shouldComponentUpdate, etc. Object
        //このエラーが出るようであればパフォーマンス改善が必要
        console.log(res)
        const canLoad = !!(res.data.searchItems.nextToken)
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
            <SafeAreaView style={{ flex: 1, backgroundColor: '#E5E5E5' }}>
                <FlatList
                    refreshing={isRefreshing}
                    onRefresh={() => this.onRefresh()}
                    data={items}
                    numColumns={3}
                    columnWrapperStyle={styles.columnWrapperStyle}
                    renderItem={({ item }) => (
                        <Item
                            detailPage='ItemDetail'
                            item={item}
                            navigation={this.props.navigation}
                        />
                    )}
                    onEndReached={(canLoad && !isLoading) ? () => this.continueLoading() : () => null}
                    onEndReachedThreshold={1}
                    ListFooterComponent={canLoad ? activityIndicator : null}
                    ListFooterComponentStyle={{ marginTop : hp('2%') }}
                    initialNumToRender={9}
                />
            </SafeAreaView>
        );
    }
}

let styles

if(Platform.isPad) {
    styles = StyleSheet.create({
        logoImage :{
            resizeMode: 'contain',
            width: wp('20%'),
            height: hp('8%')
        }
    })
} else {
    styles = StyleSheet.create({
        logoImage: {
            resizeMode: 'contain',
            width: wp('23%'),
            height: hp('10%')
        },
        columnWrapperStyle: {
            marginBottom: 10
        }
    })
}
