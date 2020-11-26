import React from 'react';
import { Text, View, StyleSheet, ScrollView, Image, SafeAreaView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card, Button } from 'react-native-elements';
import { Auth, API, graphqlOperation } from 'aws-amplify'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Modal from 'react-native-modal'
import send_message from '../../src/messaging/slack'
import * as gqlQueries from '../../src/graphql/queries' // read
import * as gqlMutations from '../../src/graphql/mutations' // create, update, delete
import FastImage from 'react-native-fast-image'

export default class ConfirmPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemCart: this.props.navigation.state.params.itemCart,
            currentUserEmail: '',
            userAddress: '',
            isConfirmModalVisible: false,
            cartLogId: ''
        }
    }

    static navigationOptions = ({ navigation: { navigate } }) => ({
        title: 'レンタルお手続き',
        headerLeft:() => <Icon name="chevron-left" size={Platform.isPad ? 60 : 42} onPress={() => { navigate('CartTab') }} />,
        headerStyle: {
            height: hp('7%')
        }
    })

    componentDidMount = async () => {
        await this.fetchCurrentUser()
    }

    fetchCurrentUser = async () => {
        const currentUser = await Auth.currentAuthenticatedUser()
        const currentUserEmail = currentUser.attributes.email
        const userRes = await API.graphql(graphqlOperation(gqlQueries.getUser, { id: currentUserEmail }))
        const userAddress = userRes.data.getUser.address
        this.setState({
            currentUserEmail: currentUserEmail,
            userAddress: userAddress
        })
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
        const { itemCart, currentUserEmail, userAddress, isConfirmModalVisible, cartLogId } = this.state
        return(
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Modal isVisible={isConfirmModalVisible}>
                        <View style={styles.modalContainerView}>
                            <View style={styles.modalInnerView}>
                                <Text style={styles.modalText}>レンタルの申し込みを{"\n"}確定してよろしいですか？</Text>
                                <View style={styles.modalButtonView}>
                                    <Button
                                        title='戻る'
                                        onPress={() => this.toggleModal()}
                                        buttonStyle={{ borderRadius: 40, width: wp('25%'), height: hp('7%'), backgroundColor: '#333333' }}
                                        titleStyle={{ fontSize: 14, color: 'white' }}
                                    />
                                    <Button
                                        title='確定する'
                                        onPress={() => this.onPressRental()}
                                        buttonStyle={{ marginLeft: wp('3%'), borderRadius: 40, width: wp('25%'), height: hp('7%'), backgroundColor: '#7389D9' }}
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
                        {itemCart.map((item, i) =>
                            <View
                                key={i}
                                style={styles.cardView}
                            >
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
                        )}
                        <View style={styles.addressView}>
                            <Text style={styles.addressTitleText}> お届け先</Text>
                            <Text style={styles.addressText}>{userAddress}</Text>
                            <View style={styles.addressAlertView} >
                                <Icon name='alert-circle' size={19} style={{ color: '#BCBCBC'}}/>
                                <Text style={styles.addressAlertText}>
                                    違う住所にお届けを希望の際は、プロフィール編集画面から登録された住所を更新してからもう一度手続きを行ってください。
                                </Text>
                            </View>
                            <Button
                                title='プロフィール編集画面へ'
                                buttonStyle={{ backgroundColor: 'transparent' }}
                                titleStyle={styles.toProfileTitleStyle}
                                onPress={() => this.props.navigation.navigate('ProfileEditPage')}
                            />
                        </View>
                        <View style={{ height: hp('40%') }}></View>
                    </ScrollView>
                </View>
                <View style={styles.rentalButtonView}>
                    <Button
                        title='レンタル確定 →'
                        buttonStyle={styles.rentalButtonStyle}
                        titleStyle={styles.rentalTitleStyle}
                        onPress={() => this.toggleModal()}
                    />
                </View>
            </SafeAreaView>
        )
    }
}

let styles

if(Platform.isPad) {
    styles = StyleSheet.create({
        container: {
            width: wp('100%'),
            height: hp('100%'),
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
            borderRadius: 70,
            width: wp('50%'),
            height: hp('8%'),
            backgroundColor: 'white'
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
            fontWeight: '400',
            textAlign: 'center'
        },
        modalButtonView: {
            flexDirection: 'row',
            marginTop: hp('2%')
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
            fontSize: 24,
            fontWeight: "400"
        },
        addressText: {
            fontSize: 22,
            marginTop: hp('2%'),
            fontWeight: '400'
        },
        addressAlertView: {
            marginTop: hp('2%'),
            flexDirection: 'row'
        },
        addressAlertText: {
            marginLeft: wp('2%'),
            color: '#BCBCBC',
            fontSize: 18
        },
        confirmView: {
            backgroundColor: 'white',
            height: hp("6%"),
            justifyContent: 'center'
        },
        confirmText: {
            textAlign: 'center',
            fontSize: 22
        },
        toProfileTitleStyle: {
            marginTop: hp('1%'),
            color: '#BCBCBC',
            textDecorationLine: 'underline',
            fontSize: 20,
            textAlign: 'left'
        }
    })
} else {
    styles = StyleSheet.create({
        container: {
            width: wp('100%'),
            height: hp('100%'),
        },
        scrollView: {
        },
        cardView: {
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
            bottom: hp('18%'),
            width: wp('56%'),
            left: wp('34%'),
            height: wp('36%'),
        },
        brand: {
            marginTop: wp('5%'),
            color: '#7389D9',
            fontSize: 12,
            width: wp('40%'),
            textAlign: 'left'
        },
        name: {
            fontSize: 16,
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
            borderRadius: 70,
            width: wp('50%'),
            height: hp('8%'),
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
            fontWeight: '400',
            textAlign: 'center'
        },
        modalButtonView: {
            flexDirection: 'row',
            marginTop: hp('2%')
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
            marginLeft: wp('2%'),
            color: '#BCBCBC',
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
        },
        toProfileTitleStyle: {
            color: '#BCBCBC',
            textDecorationLine: 'underline',
            fontSize: 14,
            left: wp('0%')
        }
    })
}

