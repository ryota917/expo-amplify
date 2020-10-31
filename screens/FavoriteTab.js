import React from 'react';
import { View, StyleSheet, Text, ScrollView, SafeAreaView, Image, FlatList, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import * as gqlQueries from '../src/graphql/queries' // read
import * as gqlMutations from '../src/graphql/mutations' // create, update, delete
import { Card } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

export default class FavoriteTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUserEmail: '',
            items: [],
            canLoad: true,
            isLoading: false,
            nextToken: '',
            isRefreshing: false
        }
    }

    static navigationOptions = ({navigation}) => ({
        headerTitle: () => (
            <Image source={require('../assets/pretapo-logo-header.png')} style={{ resizeMode: 'contain', width: wp('25%'), height: hp('10%') }}/>
        ),
        headerLeft: () => <Icon name="bars" size={24} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft: 20}}/>
    });

    componentDidMount = async () => {
        const currentUser = await Auth.currentAuthenticatedUser()
        const currentUserEmail = currentUser.attributes.email
        this.setState({ currentUserEmail: currentUserEmail })
        this.fetchFavoriteItems()
        //navigationのイベントリスナーでTabが押された時に毎回アイテム情報を取得する
        await this.props.navigation.addListener('didFocus', async () => {
            this.fetchFavoriteItems()
        })
    }

    fetchFavoriteItems = async () => {
        console.log('お気に入り初期ローディング')
        this.setState({ isLoading: true })
        const res = await API.graphql(graphqlOperation(gqlQueries.searchItemFavorites, {
            filter: {
                userId: {
                    eq: this.state.currentUserEmail
                }
            },
            limit: 30
        }))
        const items = []
        res.data.searchItemFavorites.items.forEach((val) => {
            items.push(val.item)
        })
        const canLoad = !!(res.data.searchItemFavorites.nextToken)
        this.setState({
            nextToken: res.data.searchItemFavorites.nextToken,
            items: items,
            canLoad: canLoad,
            isLoading: false
        })
    }

    fetchFavoriteItemsLoad = async () => {
        console.log('お気に入り追加ローディング')
        this.setState({ isLoading: true })
        const res = await API.graphql(graphqlOperation(gqlQueries.searchItemFavorites, {
            filter: {
                userId: {
                    eq: this.state.currentUserEmail
                }
            },
            limit: 30,
            nextToken: this.state.nextToken
        }))
        const items = []
        res.data.searchItemFavorites.items.forEach((val) => {
            items.push(val.item)
        })
        const canLoad = !!(res.data.searchItemFavorites.nextToken)
        this.setState(prevState => ({
            items: prevState.items.concat(items),
            nextToken: res.data.searchItemFavorites.nextToken,
            canLoad: canLoad,
            isLoading: false
        }))
    }

    onRefresh = async () => {
        this.setState({ isRefreshing: true })
        await this.fetchFavoriteItems()
        this.setState({ isRefreshing: false })
    }

    render() {
        const activityIndicator = <ActivityIndicator animating size='large' />
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
                            onPress={() => this.props.navigation.navigate('FavoriteItemDetail', { item: item })}
                        />
                        <Card.Title
                            style={styles.itemText}
                            onPress={() => this.props.navigation.navigate('FavoriteItemDetail', { item: item })}
                        >
                            {item.name}
                        </Card.Title>
                            </Card>
                )}
                onEndReached={(canLoad && !isLoading) ? () => this.fetchFavoriteItemsLoad() : () => null}
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
