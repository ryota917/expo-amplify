import React from 'react';
import { View, StyleSheet, Text, ScrollView, SafeAreaView, Image, FlatList, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
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
            items: [],
            canLoad: true,
            isLoading: false,
            nextToken: ''
        }
    }

    static navigationOptions = ({navigation}) => ({
        headerTitle: () => (
            <Image source={{ uri: 'https://prepota-bucket.s3-ap-northeast-1.amazonaws.com/logo-white.png'}} style={{ height: 30, paddingLeft: 210, paddingTop: 13, resizeMode: 'contain' }}/>
        ),
        headerLeft: () => <Icon name="bars" size={24} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft: 20}}/>
    });

    componentDidMount = async () => {
        //navigationのイベントリスナーでTabが押された時に毎回アイテム情報を取得する
        await this.props.navigation.addListener('didFocus', async () => {
            this.fetchFavoriteItems()
        })
    }

    fetchFavoriteItems = async () => {
        console.log('お気に入りのアイテムデータを取得します')
        const res = await API.graphql(graphqlOperation(gqlQueries.searchItems))
        console.log(res)
        const canLoad = !!(res.data.searchItems.nextToken)
        this.setState({
            items: res.data.searchItems.items,
            nextToken: res.data.searchItems.nextToken,
            canLoad: canLoad
        })
    }

    startLoading = async () => {
        console.log('ローディング開始')
        this.setState({ isLoading: true })
        const res = await API.graphql(graphqlOperation(gqlQueries.getItemFavorite))
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
        const activityIndicator = <ActivityIndicator animating/>
        const { canLoad, items, isLoading } = this.state
        return (
            <FlatList
                //onRefresh={() => {}}
                data={items}
                numColumns={3}
                columnWrapperStyle={styles.columnWrapperStyle}
                renderItem={({ item }) => (
                            <Card containerStyle={styles.cardContainer} >
                                <Card.Image
                                    source={{ uri: item.imageUrls[0] }}
                                    style={styles.itemImage}
                                    onPress={() => this.props.navigation.navigate('ItemDetail', { item: item})}
                                />
                                <Card.Title
                                    style={styles.itemText}
                                    onPress={() => this.props.navigation.navigate('ItemDetail', { item: item})}
                                >
                                        {item.name}
                                </Card.Title>
                            </Card>
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
