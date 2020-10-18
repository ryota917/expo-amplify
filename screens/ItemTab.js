import React from 'react';
import { View, StyleSheet, Text, ScrollView, SafeAreaView, Image, FlatList, ActivityIndicator } from 'react-native';
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

export default class ItemTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchCondition: [{color: ''}, {size: ''}, {season: ''}],
            items: [],
            nextToken: '',
            hasMoreItems: true
        }
    }

    static navigationOptions = ({navigation}) => ({
        title: 'アイテム',
        headerLeft: () => <Icon name="bars" size={24} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft: 20}}/>,
        headerRight:() => <Icon name='search' size={24} onPress={() => {navigation.navigate('SearchConditionModal')}} style={{paddingRight: 20}}/>
    });

    componentDidMount() {
        this.syncUserAndCartToDynamo();
        //navigationのイベントリスナーでTabが押された時に毎回アイテム情報を取得する
        this.props.navigation.addListener('didFocus', async () => {
            //stateが更新されるのとawaitしないと前のstateで表示される
            await this.updateSearchState()
            this.fetchItemsInf()
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

    //検索クエリ生成
    searchQuery = () => {
        const condition = this.state.searchCondition.filter(ele => Object.values(ele)[0].length )
        console.log(condition)
        const limitNum = condition.length
        console.log(limitNum)
        switch(limitNum) {
            case 3:
                console.log('3つ')
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
                    }
                }
                break;
            case 2:
                console.log('2つ')
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
                    }
                }
                break;
            case 1:
                console.log('1つ')
                const key = Object.keys(condition[0])
                return {
                    filter: {
                        [key]: {
                            eq: condition[0][key]
                        }
                    }
                }
                break;
            case 0:
                console.log('デフォルトです')
                return {}
        }
    }

    loadSearchQuery = () => {
        const condition = this.state.searchCondition.filter(ele => Object.values(ele)[0].length )
        console.log(condition)
        const limitNum = condition.length
        console.log(limitNum)
        switch(limitNum) {
            case 3:
                console.log('3つ')
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
                console.log('2つ')
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
                console.log('1つ')
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
                console.log('デフォルトです')
                return { limit: 3, nextToken: this.state.nextToken }
        }
    }

    fetchSearchQuery = () => {
        const condition = this.state.searchCondition.filter(ele => Object.values(ele)[0].length )
        console.log(condition)
        const limitNum = condition.length
        console.log(limitNum)
        switch(limitNum) {
            case 3:
                console.log('3つ')
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
                console.log('2つ')
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
                console.log('1つ')
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
                console.log('デフォルトです')
                return { limit: 3 }
        }
    }

    //propsでアイテム情報が渡ってきた場合はそれをstateにそれ以外の時は全てのアイテムを取得する
    fetchItems = async () => {
        const query = this.searchQuery()
        console.log(query)
        try {
            const res = await API.graphql(graphqlOperation(gqlQueries.searchItems, query))
            console.log(res)
            this.setState({
                items: res.data.searchItems.items,
            })
        } catch(e) {
            console.log(e);
        }
    }

    //Infinite最初のロード(nextTokenを含まない)
    fetchItemsInf = async () => {
        const query = this.fetchSearchQuery()
        console.log(query)
        try {
            const res = await API.graphql(graphqlOperation(gqlQueries.searchItems, query))
            console.log(res)
            //nextTokenが1なら終了
            if(res.data.searchItems.nextToken === '1') {
                this.setState({ hasMoreItems: false })
            }
            //追加するDOMの生成
            const pushItems = []
            res.data.searchItems.items.map((ite, i) => {
                pushItems.push(
                    <View>
                        <Text>item</Text>
                        <Image source={ite.imag_url} style={{ width: 100, height: 100 }}/>
                    </View>
                )
            })
            console.log(pushItems)
            const newItems = this.state.items.concat(pushItems)
            console.log('fetch時のnewItemです')
            console.log(newItems)
            //stateに追加
            this.setState({
                items: newItems,
                nextToken: res.data.searchItems.nextToken
            })
        } catch(e) {
            console.log(e);
        }
    }

    //ローディング時のアイテム取得
    loadItems = async () => {
        const query = this.loadSearchQuery()
        console.log(query)
        const res = await API.graphql(graphqlOperation(gqlQueries.searchItems, query))
        console.log(res)
        //nextTokenが1なら終了
        if(res.data.searchItems.nextToken === '1') {
            this.setState({ hasMoreItems: false })
        }
        //追加するDOMの生成
        const pushItems = []
        res.data.searchItems.items.map((ite, i) => {
            pushItems.push(
                <View>
                    <Text>item</Text>
                    <Image source={ite.imag_url} style={{ width: 100, height: 100 }}/>
                </View>
            )
        })
        const newItems = this.state.items.concat(pushItems)
        console.log('load時のnewItemdesu')
        console.log(newItems)
        //stateに追加
        this.setState({
            items: newItems,
            nextToken: res.data.searchItems.nextToken
        })
    }

    render() {
        return (
            <InfiniteScroll
                pageStart={0}
                loadMore={this.loadItems()}
                hasMore={this.state.hasMoreItems}
                loader={<div className='loader' key={0}>Loading ...</div>}
            >
                {this.state.items}
            </InfiniteScroll>
            //iphoneXにも対応するViewの生成
            //<SafeAreaView>
            /*
            <ScrollView horizontal={true} style={styles.scrollView}>
                {this.state.items.map((ele, i) => {
                    return <View key={i} style={styles.view}>
                    <Card key={i} wrapperStyle={{ padding: 0 }} containerStyle={{ padding: 0 }}>
                        <Card.Image style={styles.image} source={{ uri: ele.image_url }} />
                            //{ <Button title='press me for detail' onPress={() => this.props.navigation.navigate('ItemDetail', { item: ele })}/> }
                        <Card.Title style={styles.cardTitle}>{ele.name}</Card.Title>
                    </Card>
                    </View>
                })}
                </ScrollView>
               */
            //</SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        flexDirection: 'row',
    },
    view: {
        width: 130,
        height: 120,
    },
    image: {
        width: 100,
        height: 100,
    },
    cardTitle: {
        fontSize: 12
    }
})
