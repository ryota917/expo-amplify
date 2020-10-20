import React from 'react';
import { View, StyleSheet, Text, ScrollView, SafeAreaView, Image, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import * as gqlQueries from '../src/graphql/queries' // read
import * as gqlMutations from '../src/graphql/mutations' // create, update, delete
import { ListItem, Card, Button } from 'react-native-elements';
import InfiniteScroll from 'react-infinite-scroller';
//native-baseがエラーが出てコンパイルできないため一旦react-native-elementsを使うことにするk
//import { Container, Content, Card, CardItem } from 'native-base';
//import axios from 'axios';

const RENTAL_NUM = 4
const ITEMS_PER_PAGE = 50
const ITEM_WIDTH = Dimensions.get('window').width;

export default class ItemTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchCondition: [{color: ''}, {size: ''}, {season: ''}],
            items: [],
            nextToken: '',
            canLoad: true,
            isLoading: false
        }
    }

    static navigationOptions = ({navigation}) => ({
        title: '',
        headerBackground: (
            <Image source={{ uri: '' }} style={{ width: 5, height: 5, paddingLeft: 300, paddingTop: 100 }} />
        ),
        headerLeft: () => <Icon name="bars" size={24} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft: 20}}/>,
        headerRight:() => <Icon name='search' size={24} onPress={() => {navigation.navigate('SearchConditionModal')}} style={{paddingRight: 20}}/>
    });

    componentDidMount = async () => {
        this.syncUserAndCartToDynamo();
        //navigationのイベントリスナーでTabが押された時に毎回アイテム情報を取得する
        await this.props.navigation.addListener('didFocus', async () => {
            //stateが更新されるのとawaitしないと前のstateで表示される
            await this.updateSearchState()
            //this.fetchItemsInf()
            this.flatLoad()
        })
    }

    //App.js 153行目TODOをクリアするまで暫定的にここでSignUp時のUser登録処理を書く
    syncUserAndCartToDynamo = async () => {
        const currentUser = await Auth.currentAuthenticatedUser()
        const dynamoUser = await API.graphql(graphqlOperation(gqlQueries.getUser, {id: currentUser.username}))
        const dynamoCart = await API.graphql(graphqlOperation(gqlQueries.getCart, {id: currentUser.username}))
        if(!dynamoUser.data.getUser) {
            console.log('新規ユーザーデータを作成します')
            await API.graphql(graphqlOperation(gqlMutations.createUser, {
                input: {
                    id: currentUser.username,
                    email: currentUser.attributes.email,
                    cartId: currentUser.username,
                }
            }))
        }
        if(!dynamoCart.data.getCart) {
            console.log('新規ユーザーのカートデータを作成します')
            await API.graphql(graphqlOperation(gqlMutations.createCart, {
                input: {
                    id: currentUser.username,
                    userId: currentUser.username
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
            case 3:
                return {
                    filter: {
                        and: {
                            and: {
                                season: {
                                    eq: condition[2].season
                                }
                            },
                            size: {
                                eq: condition[1].size
                            }
                        },
                        color: {
                            eq: condition[0].color
                        }
                    },
                    limit: 3,
                    nextToken: this.state.nextToken
                }
                break;
            case 2:
                const key1 = Object.keys(condition[0])
                const key2 = Object.keys(condition[1])
                return {
                    filter: {
                        and: {
                            [key1]: {
                                eq: condition[0][key1]
                            }
                        },
                        [key2]: {
                            eq: condition[1][key2]
                        }
                    },
                    limit: 3,
                    nextToken: this.state.nextToken
                }
                break;
            case 1:
                const key = Object.keys(condition[0])
                return {
                    filter: {
                        [key]: {
                            eq: condition[0][key]
                        }
                    },
                    limit: 3,
                    nextToken: this.state.nextToken
                }
                break;
            case 0:
                return { limit: 10, nextToken: this.state.nextToken }
        }
    }

    fetchSearchQuery = () => {
        const condition = this.state.searchCondition.filter(ele => Object.values(ele)[0].length )
        const limitNum = condition.length
        switch(limitNum) {
            case 3:
                return {
                    filter: {
                        and: {
                            and: {
                                season: {
                                    eq: condition[2].season
                                }
                            },
                            size: {
                                eq: condition[1].size
                            }
                        },
                        color: {
                            eq: condition[0].color
                        }
                    },
                    limit: 3
                }
                break;
            case 2:
                const key1 = Object.keys(condition[0])
                const key2 = Object.keys(condition[1])
                return {
                    filter: {
                        and: {
                            [key1]: {
                                eq: condition[0][key1]
                            }
                        },
                        [key2]: {
                            eq: condition[1][key2]
                        }
                    },
                    limit: 3
                }
                break;
            case 1:
                const key = Object.keys(condition[0])
                return {
                    filter: {
                        [key]: {
                            eq: condition[0][key]
                        }
                    },
                    limit: 3
                }
                break;
            case 0:
                return { limit: 10 }
        }
    }

    flatLoad = async () => {
        console.log('flatLoad 開始')
        const query = await this.fetchSearchQuery()
        const res = await API.graphql(graphqlOperation(gqlQueries.searchItems, query))
        console.log(res)
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
        console.log(res)
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
                //style={styles.container}
                data={items}
                numColoms={3}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        {/* <Card containerStyle={{ padding: 0 }} wrapperStyle={{ padding: 0 }} > */}
                            {/* <Card.Image source={{ uri: item.image_url }} style={styles.image} /> */}
                            {/* <Card.Title style={{ fontSize: 10 }} >{item.name}</Card.Title> */}
                        {/* </Card> */}
                        <Image source={{ uri: item.image_url }} style={styles.image} onClick={() => this.props.navigation.navigate('ItemDetail', { item: item })} />
                    </View>
                )}
                onEndReached={(canLoad && !isLoading) ? this.startLoading : null}
                onEndReachedThreshold={1}
                ListFooterComponent={canLoad ? activityIndicator : null}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: -10,
        marginHorizontal: -10
    },
    item: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        margin: 1
    },
    image: {
        width: ITEM_WIDTH/3 - 10,
        height: ITEM_WIDTH/3 - 10,
        margin: 1,
        resizeMode: 'cover'
    }
})
