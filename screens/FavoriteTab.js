import React from 'react';
import { Platform, StyleSheet, Image, FlatList, ActivityIndicator, TouchableHighlight, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import * as gqlQueries from '../src/graphql/queries' // read
import { Card } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Item from './item/Item'
import DoubleButtonImageModal from './common/DoubleButtonImageModal'

export default class FavoriteTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUserEmail: '',
            items: [],
            canLoad: true,
            isLoading: false,
            nextToken: '',
            isRefreshing: false,
            isNotLoginModalVisible: false
        }
    }

    static navigationOptions = ({navigation}) => ({
        headerTitle: () => (
            <Image source={require('../assets/pretapo-logo-header.png')} style={styles.logoImage}/>
        ),
        headerLeft: () => <Icon name="bars" size={Platform.isPad ? 40 : 28} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft: 20}}/>,
        headerStyle: {
            height: hp('7%')
        }
    });

    componentDidMount = async () => {
        await this.fetchCurrentUser()
        this.fetchFavoriteItems()
        //navigationのイベントリスナーでTabが押された時に毎回アイテム情報を取得する
        this.props.navigation.addListener('didFocus', async () => {
            await this.showModalToLogin()
            this.fetchFavoriteItems()
        })
    }

    //ログイン促進モーダル表示判定
    showModalToLogin = () => {
        if(!this.state.currentUserEmail) {
            this.setState({ isNotLoginModalVisible: true })
        }
    }

    //ログインユーザー情報
    fetchCurrentUser = async () => {
        try {
            const currentUser = await Auth.currentAuthenticatedUser()
            const currentUserEmail = currentUser.attributes.email
            this.setState({ currentUserEmail: currentUserEmail })
        } catch(err) {
            this.setState({ isNotLoginModalVisible: true })
        }
    }

    //お気に入りアイテムの取得
    fetchFavoriteItems = async () => {
        //ログインしていない場合は処理を終了
        if(!this.state.currentUserEmail) return
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

    onPressNotLoginedModalLeftButton = () => {
        this.props.navigation.state.params.onStateChangeSignup()
    }

    onPressNotLoginedModalRightButton = () => {
        this.setState({ isNotLoginModalVisible: false })
        this.props.navigation.navigate('ItemTab')
    }

    render() {
        const activityIndicator = <ActivityIndicator animating size='large' />
        const {
            canLoad,
            items,
            isLoading,
            isRefreshing,
            isNotLoginModalVisible
        } = this.state
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <DoubleButtonImageModal
                    isModalVisible={isNotLoginModalVisible}
                    onPressLeftButton={() => this.onPressNotLoginedModalLeftButton()}
                    onPressRightButton={() => this.onPressNotLoginedModalRightButton()}
                    bigText={'この画面の表示には\nログインが必要です。'}
                    smallText={'気になる服を保存するために登録してみませんか。\nユーザー登録は無料で行えます。\n※レンタル確定には有料のレンタルプランが必要です。'}
                    leftButtonText='ユーザー登録する'
                    rightButtonText='アイテム一覧へ戻る'
                    image={require('../assets/thankYouTaggu.png')}
                />
                <FlatList
                    refreshing={isRefreshing}
                    onRefresh={() => this.onRefresh()}
                    data={items}
                    numColumns={3}
                    columnWrapperStyle={styles.columnWrapperStyle}
                    renderItem={({ item }) => (
                        <Item
                            detailPage='FavoriteItemDetail'
                            item={item}
                            navigation={this.props.navigation}
                        />
                    )}
                    onEndReached={(canLoad && !isLoading) ? () => this.fetchFavoriteItemsLoad() : () => null}
                    onEndReachedThreshold={1}
                    ListFooterComponent={canLoad ? activityIndicator : null}
                    ListFooterComponentStyle={{ marginTop : hp('2%') }}
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
            marginBottom: 10,
        }
    })
}
