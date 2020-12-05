import React from 'react';
import { Platform, Image, Text, View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Card, Button } from 'react-native-elements';
import { Auth, API, graphqlOperation } from 'aws-amplify'
import * as gqlQueries from '../../../src/graphql/queries' // read
import * as gqlMutations from '../../../src/graphql/mutations' // create, update, delete
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Modal from 'react-native-modal'
import FastImage from 'react-native-fast-image'
import DoubleButtonModal from '../common/DoubleButtonModal'
import { TouchableHighlight } from 'react-native-gesture-handler';
import DoubleButtonImageModal from '../common/DoubleButtonImageModal'

export default class CartTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemCart: [],
            itemCartLog: [],
            currentUserEmail: '',
            isCartFilled: false,
            //レンタル中かどうか
            isRental: false,
            //次のレンタル可能日を過ぎているかどうか
            canNextRental: false,
            //次のレンタル可能日
            canNextRentalDate: '',
            //レンタル可能か(レンタル中でないかつ、一ヶ月以内にレンタルしていない)
            canRental: true,
            isRentalAlertVisible: false,
            selectedDeleteItem: [],
            isDeleteConfirmModalVisible: false,
            cartNum: 0,
            isNotLoginModalVisible: false
        }
    }

    static navigationOptions = ({navigation}) => ({
        headerTitle: () => (
            <Image source={require('../../../assets/pretapo-logo-header.png')} style={styles.logoImage}/>
        ),
        headerLeft: () => <Icon name="bars" size={Platform.isPad ? 40 : 28} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft: 20}}/>,
        headerStyle: {
            height: hp('7%')
        }
    });

    componentDidMount = async () => {
        await this.fetchCurrentUser()
        this.fetchItemCart()
        this.fetchRentalData()
        //Tab移動時のイベントリスナー(カートに追加したアイテムが反映されないのでここで再度取得)
        this.props.navigation.addListener('didFocus', async () => {
                await this.showModalToLogin()
                this.fetchItemCart()
                this.fetchRentalData()
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

    //Cartに入っているアイテムを取得
    fetchItemCart = async () => {
        //ログインしていない場合は処理を終了
        if(!this.state.currentUserEmail) return
        try {
            const res = await API.graphql(graphqlOperation(gqlQueries.searchItemCarts, {
                filter: {
                    cartId: {
                        eq: this.state.currentUserEmail
                    }
                }
            }))
            const itemArray = []
            res.data.searchItemCarts.items.forEach(obj => itemArray.push(obj.item))
            const cartNum = res.data.searchItemCarts.items.length
            const isCartFilled = res.data.searchItemCarts.items.length >= 5
            this.setState({
                itemCart: itemArray,
                isCartFilled: isCartFilled,
                cartNum: cartNum
            })
        } catch(e) {
            console.error(e);
        }
    }

    //レンタル履歴を取得
    fetchRentalData = async () => {
        //ログインしていない場合は処理を終了
        if(!this.state.currentUserEmail) return
        try {
            const cartLogRes = await API.graphql(graphqlOperation(gqlQueries.searchCartLogs, {
                filter: {
                    userId: {
                        eq: this.state.currentUserEmail
                    }
                },
                sort: {
                    field: 'createdAt',
                    direction: 'desc'
                },
                limit: 1
            }))
            console.log(cartLogRes)
            const cartLogId = cartLogRes.data.searchCartLogs.items[0].id
            const itemCartLogRes = await API.graphql(graphqlOperation(gqlQueries.searchItemCartLogs, {
                filter: {
                    cartLogId: {
                        eq: cartLogId
                    }
                }
            }))
            //最新のカートログに入っているアイテムデータを取得
            const itemCartLogArr = []
            console.log(itemCartLogRes)
            itemCartLogRes.data.searchItemCartLogs.items.map(obj => itemCartLogArr.push(obj.item))
            //次回レンタル可能な日付データを取得(CartLogが存在しない場合はレンタル可能判定にする)
            let canNextRental = true
            let canNextRentalDate = new Date()
            if(cartLogRes.data.searchCartLogs.items.length) {
                canNextRentalDate = new Date(cartLogRes?.data?.searchCartLogs?.items[0]?.createdAt)
                canNextRentalDate.setMonth(canNextRentalDate.getMonth() + 2)
                const today = new Date()
                canNextRental = canNextRentalDate.getTime() < new Date(today).getTime()
            } else {
                canNextRental = true
            }
            //現在レンタル中かのデータを取得
            const userRes = await API.graphql(graphqlOperation(gqlQueries.getUser, { id: this.state.currentUserEmail }))
            const isRental = userRes.data.getUser.rental
            //レンタルが可能かどうか
            const canRental = canNextRental && !isRental
            this.setState({
                itemCartLog: itemCartLogArr,
                canNextRental: canNextRental,
                isRental: isRental,
                canRental: canRental,
                canNextRentalDate: canNextRentalDate
            })
        } catch(err) {
            console.error(err)
        }
    }

    //Cartに入っているアイテムを削除
    deleteItemFromCart = async () => {
        const { currentUserEmail, selectedDeleteItem } = this.state
        await API.graphql(graphqlOperation(gqlMutations.updateItem, {
            input: {
                id: selectedDeleteItem.id,
                status: 'WAITING'
            }
        }))
        const res = await API.graphql(graphqlOperation(gqlMutations.deleteItemCart, {
            input: {
                id: currentUserEmail + selectedDeleteItem.id
            }
        }))
        //削除したアイテムをstateから削除(再レンダリングしなくてもアイテムが消えるように)
        const newArray = this.state.itemCart.filter(ele => !(ele.id === res.data.deleteItemCart.itemId))
        const isCartFilled = newArray.length >= 5
        this.setState({
            itemCart: newArray,
            isCartFilled: isCartFilled,
            cartNum: this.state.cartNum - 1,
            isDeleteConfirmModalVisible: false
        })
    }

    navigateConfirmPage = () => {
        this.props.navigation.navigate('ConfirmPage', { itemCart: this.state.itemCart })
    }

    toggleAlertModal = () => {
        this.setState({ isRentalAlertVisible: !this.state.isRentalAlertVisible })
    }

    onPressNotLoginedModalLeftButton = () => {
        this.props.navigation.state.params.onStateChangeSignup()
    }

    onPressNotLoginedModalRightButton = () => {
        this.setState({ isNotLoginModalVisible: false })
        this.props.navigation.navigate('ItemTab')
    }

    render() {
        const {
            isCartFilled,
            isRental,
            isNotLoginModalVisible,
            canRental,
            canNextRental,
            canNextRentalDate,
            cartNum,
            isDeleteConfirmModalVisible
        } = this.state
        const nextRentalText = (new Date(canNextRentalDate).getMonth() + 1) + '月' + new Date(canNextRentalDate).getDate() + '日'
        const rentalAlertText = canRental ? 'カートに5つアイテムを入れた状態で\n手続きを行ってください' : '次回のレンタル可能日(' + nextRentalText  + ')まで\nお待ちください'
        return(
            <SafeAreaView style={{ flex: 1 }}>
                <Modal isVisible={this.state.isRentalAlertVisible}>
                    <View style={styles.modalContainerView}>
                        <View style={styles.modalInnerView}>
                            <Text style={styles.modalText}>{rentalAlertText}</Text>
                            <View style={styles.modalButtonView}>
                                <Button
                                    title='OK'
                                    onPress={() => this.toggleAlertModal()}
                                    buttonStyle={{ borderRadius: 25, width: wp('25%'), height: hp('6%'), backgroundColor: '#7389D9' }}
                                    titleStyle={{ fontSize: 14, color: 'white' }}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
                <DoubleButtonModal
                    isModalVisible={isDeleteConfirmModalVisible}
                    onPressLeftButton={() => this.setState({ isDeleteConfirmModalVisible: false })}
                    onPressRightButton={() => this.deleteItemFromCart()}
                    text={'このアイテムをカートから' + '\n' + '消去してよろしいですか？'}
                    leftButtonText='キャンセル'
                    rightButtonText='消去'
                />
                <DoubleButtonImageModal
                    isModalVisible={isNotLoginModalVisible}
                    onPressLeftButton={() => this.onPressNotLoginedModalLeftButton()}
                    onPressRightButton={() => this.onPressNotLoginedModalRightButton()}
                    bigText={'この画面の表示には\nログインが必要です。'}
                    smallText={'レンタルを検討するためにはまず登録!\nユーザー登録は無料で行えます。\n※レンタル確定には有料のレンタルプランが必要です。'}
                    leftButtonText='ユーザー登録する'
                    rightButtonText='アイテム一覧へ戻る'
                    image={require('../../../assets/thankYouTaggu.png')}
                />
                {isRental ?
                    <View style={styles.isRentalView}>
                        <Image source={require('../../../assets/error.png')} style={styles.errorImage}/>
                        <Text style={styles.isRentalText}>以下のアイテムを現在レンタル中です。</Text>
                    </View>
                :
                    <View style={styles.isCartNumView}>
                        <Text style={styles.isCartNumText}>カートにアイテムが{cartNum}点入っています。</Text>
                    </View>
                }
                <ScrollView style={styles.scrollView}>
                    {isRental ?
                        this.state.itemCartLog.map((item, i) =>
                            <TouchableHighlight
                                key={i}
                                underlayColor='white'
                                onPress={() => this.props.navigation.navigate('CartItemDetail', { item: item })}
                            >
                                <View style={styles.cardView}>
                                    <FastImage
                                        source={{ uri: item.imageURLs[0] }}
                                        style={styles.image}
                                    />
                                    <View style={styles.textView}>
                                        <Card.Title style={styles.brand}>{item.brand}</Card.Title>
                                        <Card.Title style={styles.name}>{item.name}</Card.Title>
                                        <Card.Title style={styles.category}>{item.bigCategory === 'OUTER' ? 'アウター' : 'トップス'}</Card.Title>
                                        <Card.Title style={styles.rank}>{item.rank}ランク</Card.Title>
                                    </View>
                                </View>
                            </TouchableHighlight>
                        )
                    :
                        this.state.itemCart.map((item, i) =>
                            <View style={styles.cardView} key={i}>
                                <TouchableHighlight
                                    underlayColor='white'
                                    onPress={() => this.props.navigation.navigate('CartItemDetail', { item: item })}
                                >
                                    <FastImage
                                        source={{ uri: item.imageURLs[0] }}
                                        style={styles.image}
                                    />
                                </TouchableHighlight>
                                <View style={styles.textView}>
                                    <Card.Title style={styles.brand} onPress={() => this.props.navigation.navigate('CartItemDetail', { item: item })}>{item.brand}</Card.Title>
                                    <Card.Title style={styles.name} onPress={() => this.props.navigation.navigate('CartItemDetail', { item: item })}>{item.name}</Card.Title>
                                    <Card.Title style={styles.category} onPress={() => this.props.navigation.navigate('CartItemDetail', { item: item })}>{item.bigCategory === 'OUTER' ? 'アウター' : 'トップス'}</Card.Title>
                                    <Card.Title style={styles.rank} onPress={() => this.props.navigation.navigate('CartItemDetail', { item: item })}>{item.rank}ランク</Card.Title>
                                    <Icon name='trash-o' size={Platform.isPad ? 45 : 30} style={styles.trashButton} onPress={() => this.setState({ isDeleteConfirmModalVisible: true, selectedDeleteItem: item })} />
                                </View>
                            </View>
                        )
                    }
                    <View style={{ height: hp('15%') }}></View>
                </ScrollView>
                {isRental ?
                    canNextRental ? null :
                    <View style={styles.nextRentalDateAlertView}>
                        <Text style={styles.nextRentalDateAlertText}>次は<Text style={{ fontSize: 24 }}>{nextRentalText}</Text>からレンタルできます。</Text>
                    </View>
                :
                    <View style={styles.rentalButtonView}>
                        <Button
                            title='レンタル手続きへ →'
                            buttonStyle={[styles.rentalButtonStyle, { backgroundColor: (isCartFilled && canRental) ? 'white': 'rgba(255,255,255,0.5)' }]}
                            titleStyle={styles.rentalTitleStyle}
                            onPress={(isCartFilled && canRental) ? () => this.navigateConfirmPage() : () => this.toggleAlertModal()}
                        />
                    </View>
                }
            </SafeAreaView>
        )
    }
}

let styles

if(Platform.isPad) {
    styles = StyleSheet.create({
        logoImage: {
            resizeMode: 'contain',
            width: wp('20%'),
            height: hp('8%')
        },
        isRentalView: {
            backgroundColor: 'white',
            height: hp('6%'),
            flexDirection: 'row',
            justifyContent: 'center'
        },
        isRentalText: {
            textAlign: 'center',
            color: '#7288D7',
            marginTop: hp('2%'),
            fontWeight: '500'
        },
        errorImage: {
            width: wp('6%'),
            height: wp('6%'),
            resizeMode: 'contain',
            marginTop: wp('3.4%'),
            marginRight: wp('2%')
        },
        isCartNumView: {
            backgroundColor: 'white',
            height: hp("6%"),
            justifyContent: 'center'
        },
        isCartNumText: {
            textAlign: 'center',
            fontSize: 20
        },
        scrollView: {
        },
        cardView: {
            flexDirection: 'row',
            backgroundColor: 'white',
            height: wp('32%'),
            margin: wp('2%')
        },
        image: {
            width: wp('20%'),
            height: wp('27%'),
            margin: wp('3%')
        },
        textView: {
            width: wp('68%'),
            height: wp('36%'),
        },
        brand: {
            marginTop: wp('6%'),
            color: '#7389D9',
            fontSize: 20,
            width: wp('40%'),
            textAlign: 'left'
        },
        name: {
            marginTop: hp('1.5%'),
            fontSize: 22,
            width: wp('50%'),
            textAlign: 'left'
        },
        category: {
            marginTop: hp('1.5%'),
            fontSize: 18,
            color: '#828282',
            width: wp('40%'),
            textAlign: 'left',
        },
        rank: {
            marginTop: hp('1.5%'),
            fontSize: 18,
            backgroundColor: '#C4C4C4',
            color: 'white',
            width: wp('22%'),
        },
        trashButton: {
            color: '#7389D9',
            marginLeft: wp('60%'),
            marginTop: -wp('4%')
        },
        rentalButtonView: {
            position: 'absolute',
            right: wp('6%'),
            bottom: hp('4%'),
            shadowColor: 'black',
            shadowOffset: { width: 10, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 80
        },
        rentalButtonStyle: {
            borderRadius: 80,
            width: wp('50%'),
            height: hp('8%'),
        },
        rentalTitleStyle: {
            color: '#7389D9',
            fontSize: 20,
            fontWeight: 'bold'
        },
        modalContainerView: {
            backgroundColor: 'white',
            width: wp('70%'),
            height: hp('30%'),
            left: wp('10%'),
            textAlign: 'center',
            borderRadius: 15
        },
        modalInnerView: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        },
        modalText: {
            marginBottom: hp('2%'),
            fontWeight: '400'
        },
        modalButtonView: {
            marginTop: hp('2%')
        },
        nextRentalDateAlertView: {
            position: 'absolute',
            width: wp('100%'),
            bottom: hp('0%'),
            height: hp('8%'),
            backgroundColor: '#7389D9'
        },
        nextRentalDateAlertText: {
            textAlign: 'center',
            marginTop: hp('2%'),
            color: 'white',
            fontSize: 15
        }
    })
} else {
    styles = StyleSheet.create({
        logoImage: {
            resizeMode: 'contain',
            width: wp('23%'),
            height: hp('10%')
        },
        isRentalView: {
            backgroundColor: 'white',
            height: hp('6%'),
            flexDirection: 'row',
            justifyContent: 'center'
        },
        isRentalText: {
            textAlign: 'center',
            color: '#7288D7',
            marginTop: hp('2%'),
            fontWeight: '500'
        },
        errorImage: {
            width: wp('6%'),
            height: wp('6%'),
            resizeMode: 'contain',
            marginTop: wp('3.4%'),
            marginRight: wp('2%')
        },
        isCartNumView: {
            backgroundColor: 'white',
            height: hp("6%"),
            justifyContent: 'center'
        },
        isCartNumText: {
            textAlign: 'center',
        },
        scrollView: {
        },
        cardView: {
            flexDirection: 'row',
            backgroundColor: 'white',
            height: wp('42%'),
            margin: wp('2%')
        },
        image: {
            width: wp('27%'),
            height: wp('36%'),
            margin: wp('3%')
        },
        textView: {
            width: wp('56%'),
            height: wp('36%'),
        },
        brand: {
            marginTop: wp('6%'),
            color: '#7389D9',
            fontSize: 12,
            width: wp('40%'),
            textAlign: 'left'
        },
        name: {
            fontSize: 14,
            width: wp('50%'),
            textAlign: 'left'
        },
        category: {
            fontSize: 11,
            color: '#828282',
            width: wp('40%'),
            textAlign: 'left',
        },
        rank: {
            fontSize: 12,
            backgroundColor: '#C4C4C4',
            color: 'white',
            width: wp('22%'),
        },
        trashButton: {
            color: '#7389D9',
            marginLeft: wp('47%'),
            marginTop: -wp('9%')
        },
        rentalButtonView: {
            position: 'absolute',
            right: wp('6%'),
            bottom: hp('4%'),
            shadowColor: 'black',
            shadowOffset: { width: 10, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 80
        },
        rentalButtonStyle: {
            borderRadius: 40,
            width: wp('50%'),
            height: hp('8%'),
        },
        rentalTitleStyle: {
            color: '#7389D9',
            fontSize: 16,
            fontWeight: 'bold'
        },
        modalContainerView: {
            backgroundColor: 'white',
            width: wp('70%'),
            height: hp('30%'),
            left: wp('10%'),
            textAlign: 'center',
            borderRadius: 15
        },
        modalInnerView: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        },
        modalText: {
            marginBottom: hp('2%'),
            fontWeight: '400'
        },
        modalButtonView: {
            marginTop: hp('2%')
        },
        nextRentalDateAlertView: {
            position: 'absolute',
            width: wp('100%'),
            bottom: hp('0%'),
            height: hp('8%'),
            backgroundColor: '#7389D9'
        },
        nextRentalDateAlertText: {
            textAlign: 'center',
            marginTop: hp('2%'),
            color: 'white',
            fontSize: 15
        }
    })
}