import React from 'react';
import { Image, View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as gqlQueries from '../../src/graphql/queries'
import * as gqlMutations from '../../src/graphql/mutations'
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Swiper from 'react-native-swiper'
import FastImage from 'react-native-fast-image'
import ItemDetailScreen from '../item/ItemDetailScreen'

export default class FavoriteItemDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: this.props.navigation.state.params.item,
            currentUserEmail: '',
            isFavorited: false,
            isCarted: false,
            isCartModalVisible: false
        }
    }

    static navigationOptions = ({navigation: { navigate }}) => ({
        title: 'アイテム詳細',
        headerLeft:() => <Icon name="chevron-left" size={42} onPress={()=>{navigate('CartTab')}} style={{ paddingLeft: wp('3%')}} />,
        headerStyle: {
            height: hp('7%')
        }
    });

    componentDidMount = async () => {
        await this.fetchCurrentUser()
        this.setFavoritedOrCarted()
    }

    fetchCurrentUser = async () => {
        const currentUser = await Auth.currentAuthenticatedUser()
        const currentUserEmail = currentUser.attributes.email
        this.setState({ currentUserEmail: currentUserEmail })
    }

    setFavoritedOrCarted = () => {
        console.log(this.props.navigation.state.params.item)
        const isFavorited = this.props.navigation.state.params.item.favoriteUser.items?.some(item => item.userId === this.state.currentUserEmail)
        this.setState({
            isFavorited: isFavorited
        })
    }

    //お気に入りに追加
    saveItemToFavorite = async () => {
        this.setState({ isFavorited: true })
        const { currentUserEmail, item } = this.state
        await API.graphql(graphqlOperation(gqlMutations.createItemFavorite, {
            input: {
                id: currentUserEmail + item["id"],
                itemId: item["id"],
                userId: currentUserEmail
            }
        }))
    }

    //お気に入りから削除
    deleteItemFromFavorite = async () => {
        this.setState({ isFavorited: false })
        const { currentUserEmail, item } = this.state
        await API.graphql(graphqlOperation(gqlMutations.deleteItemFavorite, {
            input: {
                id: currentUserEmail + item["id"]
            }
        }))
    }

    //カートに追加
    saveItemToCart = async () => {
        const { currentUserEmail, item } = this.state
        this.toggleCartModal()
        this.setState({ isCarted: true })
        try {
            //アイテムがWAITINGであることを確認できればカート保存処理を実行
            const itemData = await API.graphql(graphqlOperation(gqlQueries.getItem, { id: item["id"] }))
            if(itemData.data.getItem.status === 'WAITING') {
                await API.graphql(graphqlOperation(gqlMutations.updateItem, {
                    input: {
                        id: item["id"],
                        status: 'CARTING'
                    }
                }))
                await API.graphql(graphqlOperation(gqlMutations.createItemCart, {
                    input: {
                        id: currentUserEmail + item["id"],
                        itemId: item["id"],
                        cartId: currentUserEmail
                    }
                }))
            }
        } catch(err) {
            console.error(err)
        }
    }

    //モーダルを開閉
    toggleCartModal = () => {
        this.setState({ isCartModalVisible: !this.state.isCartModalVisible })
    }

    render() {
        const { item, isFavorited, isRental } = this.state
        const imagesDom = item.imageURLs.map((imgUrl, idx) =>
        <FastImage key={idx} source={{ uri: imgUrl }} style={{ width: wp('100%'), height: wp('133%'), resizeMode: 'contain' }}/>
        )
        return(
            <SafeAreaView style={{ flex: 1 }}>
                <ItemDetailScreen
                    item={item}
                    isFavorited={isFavorited}
                    isRental={isRental}
                    saveItemToFavorite={this.saveItemToFavorite}
                    deleteItemFromFavorite={this.deleteItemFromFavorite}
                />
            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        width: wp('100%'),
        height: hp('100%')
    },
    scrollView: {
        width: wp('100%'),
        height: hp('100%'),
        flex: 1
    },
    innerContainer: {
        width: wp('80%')
    },
    imagesView: {
        width: wp('100%'),
        height: wp('133%')
    },
    footerView: {
        height: hp('20%'),
        bottom: hp('7%'),
    },
    footerInnerView: {
        flex: 1,
        alignItems: 'center',
    }
})
