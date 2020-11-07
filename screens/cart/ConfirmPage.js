import React from 'react';
import { Text, View, StyleSheet, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card, Button } from 'react-native-elements';
import { Auth, API, graphqlOperation } from 'aws-amplify'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Modal from 'react-native-modal'
import send_message from '../../src/messaging/slack'
import * as gqlQueries from '../../src/graphql/queries' // read
import * as gqlMutations from '../../src/graphql/mutations' // create, update, delete

export default class ConfirmPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemCart: this.props.navigation.state.params.itemCart,
            currentUserEmail: '',
            isCartFilled: false,
            isConfirmModalVisible: false,
            cartLogId: ''
        }
    }

    static navigationOptions = ({ navigation: { navigate } }) => ({
        title: 'レンタルお手続き',
        headerLeft:() => <Icon name="chevron-left" size={28} onPress={() => { navigate('CartTab') }} style={{ paddingLeft: wp('3%')}} />
    })

    componentDidMount = async () => {
        await this.fetchCurrentUser()
    }

    fetchCurrentUser = async () => {
        const currentUser = await Auth.currentAuthenticatedUser()
        const currentUserEmail = currentUser.attributes.email
        this.setState({ currentUserEmail: currentUserEmail })
    }

    toggleModal = () => {
        this.setState({ isConfirmModalVisible: !this.state.isConfirmModalVisible })
    }

    //レンタル確定
    onPressRental = async () => {
        this.toggleModal()
        this.props.navigation.navigate('ThankYouPage')
        //slackに通知
        const orderedUser = await API.graphql(graphqlOperation(gqlQueries.getUser, { id: this.state.currentUserEmail }))
        const name = orderedUser.data.getUser.name
        const address = orderedUser.data.getUser.address
        const itemIdArr = []
        this.state.itemCart.forEach(item => {
            itemIdArr.push(item.id)
        })
        const message = '注文が届いたよ\n注文したユーザーは' + name + '様だよ\n注文したユーザーの住所は' + address + 'だよ\n注文したアイテムは\n' + itemIdArr
        send_message(message)
        try{
            //CartLogの生成
            await this.createCartLog()
            //Userステータスをレンタルに変更
            await this.changeUserStatus()
            //それぞれのアイテムをレンタル処理
            this.state.itemCart.map(item => {
                this.rentalItem(item)
            })
        } catch(err) {
            console.log(err)
        }
    }

    rentalItem = async (item) => {
        //アイテムステータスの変更
        await API.graphql(graphqlOperation(gqlMutations.updateItem, {
            input: {
                id: item.id,
                status: 'RENTAL'
            }
        }))
        //カートからアイテムを削除
        API.graphql(graphqlOperation(gqlMutations.deleteItemCart, {
            input: {
                id: this.state.currentUserEmail + item.id
            }
        }))
        //CartLogにアイテムを追加
        API.graphql(graphqlOperation(gqlMutations.createItemCartLog, {
            input: {
                id: this.state.currentUserEmail + this.state.cartLogNum + item.id,
                itemId: item.id,
                cartLogId: this.state.currentUserEmail + this.state.cartLogNum
            }
        }))
    }

    createCartLog = async () => {
        //現在のユーザーのCartLogの数を確認
        const res = await API.graphql(graphqlOperation(gqlQueries.searchCartLogs, {
            filter: {
                userId: {
                    eq: this.state.currentUserEmail
                }
            }
        }))
        const cartLogNum = res.data.searchCartLogs.items.length + 1
        API.graphql(graphqlOperation(gqlMutations.createCartLog, {
            input: {
                id: this.state.currentUserEmail + cartLogNum,
                userId: this.state.currentUserEmail
            }
        }))
        this.setState({ cartLogNum: cartLogNum })
    }

    changeUserStatus = async () => {
        await API.graphql(graphqlOperation(gqlMutations.updateUser, {
            input: {
                id: this.state.currentUserEmail,
                rental: true
            }
        }))
    }

    render() {
        return(
            <View style={styles.container}>
                <Modal isVisible={this.state.isConfirmModalVisible}>
                    <View style={styles.modalContainerView}>
                        <View style={styles.modalInnerView}>
                            <Text style={styles.modalText}>レンタルの申し込みを{"\n"}確定してよろしいですか？</Text>
                            <View style={styles.modalButtonView}>
                                <Button
                                    title='戻る'
                                    onPress={() => this.toggleModal()}
                                    buttonStyle={{ borderRadius: 25, width: wp('25%'), height: hp('6%'), backgroundColor: '#333333' }}
                                    titleStyle={{ fontSize: 14, color: 'white' }}
                                />
                                <Button
                                    title='確定する'
                                    onPress={() => this.onPressRental()}
                                    buttonStyle={{ marginLeft: wp('3%'), borderRadius: 25, width: wp('25%'), height: hp('6%'), backgroundColor: '#7389D9' }}
                                    titleStyle={{ fontSize: 14, color: 'white' }}
                                />
                            </View>
                            <Image source={require('../../assets/food.png')} style={styles.foodImage} />
                        </View>
                    </View>
                </Modal>
                <View style={styles.confirmView}>
                    <Text style={styles.confirmText}>これらのアイテムをお届けします。</Text>
                </View>
                <ScrollView style={styles.scrollView}>
                    {this.state.itemCart.map((item, i) =>
                        <View style={styles.cardContainer} key={i}>
                            <Card wrapperStyle={{ height: wp('27%')}}>
                                <Card.Image
                                    source={{ uri: item.imageURLs[0] }}
                                    style={styles.image}
                                    onPress={() => this.props.navigation.navigate('CartItemDetail', { item: item })}
                                />
                                <Card.Title style={styles.brand} >ブランド</Card.Title>
                                <Card.Title style={styles.name} >{item.name}</Card.Title>
                                <Card.Title style={styles.category} >アウター</Card.Title>
                                <Card.Title style={styles.rank} >Sランク</Card.Title>
                            </Card>
                        </View>
                    )}
                    <View style={styles.addressView}>
                        <Text style={styles.addressTitleText}> お届け先</Text>
                        <Text style={styles.addressText}>京都市左京区大久保西区プレタポルテ245</Text>
                        <View style={styles.addressAlertView} >
                            <Icon name='alert-circle' size={19} style={{ color: '#BCBCBC'}}/>
                            <Text style={styles.addressAlertText}>
                                違う住所にお届けを希望の際は、プロフィール編集画面から登録された住所を更新してからもう一度手続きを行ってください。
                                <Button
                                    title='プロフィール編集画面へ'
                                    buttonStyle={{ backgroundColor: 'transparent' }}
                                    titleStyle={{ color: '#BCBCBC', textDecorationLine: 'underline', fontSize: 14 }}
                                    onPress={() => this.props.navigation.navigate('ProfileEditPage')}
                                />
                            </Text>
                        </View>
                    </View>
                    <View style={{ height: hp('34%') }}></View>
                </ScrollView>
                <View style={styles.rentalButtonView}>
                    <Button
                        title='レンタル確定 →'
                        buttonStyle={styles.rentalButtonStyle}
                        titleStyle={styles.rentalTitleStyle}
                        onPress={() => this.toggleModal()}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: wp('100%'),
        height: hp('100%'),
    },
    scrollView: {
    },
    cardContainer: {
    },
    image: {
        width: wp('27%'),
        height: wp('27%')
    },
    brand: {
        marginTop: -wp('26%'),
        color: '#7389D9',
        fontSize: 12,
        width: wp('40%'),
        marginLeft: wp('30%'),
        textAlign: 'left'
    },
    name: {
        marginTop: -wp('2%'),
        fontSize: 16,
        width: wp('50%'),
        marginLeft: wp('30%'),
        textAlign: 'left'
    },
    category: {
        marginTop: -wp('3%'),
        fontSize: 11,
        color: '#828282',
        width: wp('40%'),
        textAlign: 'left',
        marginLeft: wp('30%')
    },
    rank: {
        marginTop: -wp('1%'),
        fontSize: 12,
        backgroundColor: '#C4C4C4',
        color: 'white',
        width: wp('22%'),
        marginLeft: wp('30%')
    },
    trashButton: {
        color: '#7389D9',
        marginLeft: wp('78%'),
        marginTop: -wp('9%')
    },
    rentalButtonView: {
        position: 'absolute',
        right: wp('6%'),
        bottom: hp('20%'),
        backgroundColor: 'transparent',
        shadowColor: 'black',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 20
    },
    rentalButtonStyle: {
        borderRadius: 30,
        width: wp('50%'),
        height: hp('7%'),
        backgroundColor: 'white'
    },
    rentalTitleStyle: {
        color: '#7389D9',
        fontSize: 16,
        fontWeight: 'bold'
    },
    modalContainerView: {
        backgroundColor: 'white',
        width: wp('70%'),
        height: hp('35%'),
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
        fontWeight: '500',
        textAlign: 'center'
    },
    modalButtonView: {
        flexDirection: 'row'
    },
    foodImage: {
        width: wp('20%'),
        height: wp('20%'),
        resizeMode: 'contain',
        position: 'absolute',
        right: -wp('3%'),
        bottom: hp('0%')
    },
    addressView: {
        width: wp('80%'),
        left: wp('10%'),
        marginTop: hp('5%')
    },
    addressTitleText: {
        fontSize: 16,
        fontWeight: "400"
    },
    addressText: {
        fontSize: 18,
        marginTop: hp('2%'),
        fontWeight: '400'
    },
    addressAlertView: {
        marginTop: hp('2%'),
        flexDirection: 'row'
    },
    addressAlertText: {
        color: '#BCBCBC',
        marginLeft: wp('2%'),
        fontSize: 14
    },
    confirmView: {
        backgroundColor: 'white',
        height: hp("6%"),
        justifyContent: 'center'
    },
    confirmText: {
        textAlign: 'center',
        fontWeight: '500'
    }
})
