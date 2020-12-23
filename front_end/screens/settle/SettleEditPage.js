import React from 'react'
import { StyleSheet, View, Image, Text, SafeAreaView, ScrollView } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Icon from 'react-native-vector-icons/FontAwesome'
import { API, graphqlOperation, Auth } from 'aws-amplify';
import * as gqlQueries from 'pretapo/src/graphql/queries' // read
import * as gqlMutations from 'pretapo/src/graphql/mutations'
import { PAYJP, payjpAxios, cardBrandImageUrl } from 'pretapo/front_end/screens/common/Payjp'
import qs from 'qs'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { TouchableHighlight } from 'react-native-gesture-handler';
import { CardForm } from 'pretapo/front_end/screens/cart/CardForm'
import PayJpBridge from 'pretapo/front_end/screens/cart/PayJpBridge';
import ErrorAlertModal from 'pretapo/front_end/screens/common/ErrorAlertModal'
import { Button } from 'react-native-elements'
import DoubleButtonModal from 'pretapo/front_end/screens/common/DoubleButtonModal'
import SingleButtonModal from 'pretapo/front_end/screens/common/SingleButtonModal'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'

export class SettleEditPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUserEmail: '',
            customerId: '',
            subscriptionId: '',
            otherCards: [],
            defaultCard: {},
            isErrorAlertModalVisible: false,
            isDeleteModalVisible: false,
            isChangeModalVisible: false,
            selectedCardId: '',
            isAddCardModalVisible: false,
            nextBillingTime: '',
            registered: false
        }
    }

    static navigationOptions = ({navigation}) => ({
        title: '決済情報の編集',
        headerLeft: () => <Icon name="bars" size={28} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft:20}}/>,
        headerStyle: {
            height: hp('7%')
        }
    });

    componentDidMount = async () => {
        try {
            await this.fetchCurrentUser()
            this.fetchPayjpData()
            this.props.navigation.addListener('didFocus', async () => {
                this.fetchPayjpData()
            })
        } catch(e) {
            console.error(e)
        }
    }

    //ログインユーザー情報取得
    fetchCurrentUser = async () => {
        const currentUser = await Auth.currentAuthenticatedUser()
        const currentUserEmail = currentUser.attributes.email
        const userRes = await API.graphql(graphqlOperation(gqlQueries.getUser, { id: currentUserEmail }))
        const customerId = userRes.data.getUser.customerId
        const registered = userRes.data.getUser.registered
        this.setState({
            currentUserEmail: currentUserEmail,
            customerId: customerId,
            registered: registered
        })
    }

    //customerIdを元にPayjpからデータ取得
    fetchPayjpData = () => {
        const { customerId } = this.state
        if(!customerId) return
        payjpAxios.get('/customers/' + customerId)
            .then(res => {
                const resObj = JSON.parse(res['request']['_response'])
                //次回請求日取得
                const unixTime = new Date(resObj.subscriptions?.data[0]?.current_period_end * 1000)
                const nextBillingTime = unixTime.getFullYear() + '/' + unixTime.getMonth() + 1 + '/'  + unixTime.getDate()
                const subscriptionId = resObj.subscriptions?.data[0]?.id
                let cards = []
                resObj.cards.data.map(card => cards.push(card))
                const defaultCardId = resObj.default_card
                const otherCards = cards.filter(card => card.id !== defaultCardId)
                const defaultCard = cards.find(card => card.id === defaultCardId)
                this.setState({
                    subscriptionId: subscriptionId,
                    otherCards: otherCards,
                    defaultCard: defaultCard,
                    nextBillingTime: nextBillingTime
                })
            })
    }

    //初回カード登録時
    //TokenをもとにCardが紐づくCustomerを作成
    createCustomerByToken = async (tokenId) => {
        payjpAxios.post(
            'customers',
            qs.stringify({
                email: this.state.currentUserEmail,
                card: tokenId
            })
        )
            .then(res => {
                const customerId = JSON.parse(res['request']['_response'])['id']
                //customerIdをUserデータに保存
                API.graphql(graphqlOperation(gqlMutations.updateUser, {
                    input: {
                        id: this.state.currentUserEmail,
                        customerId: customerId
                    }
                }))
                this.setState({ customerId: customerId })
            })
            .catch(e => console.log('error creating payjp customer', e))
    }


    //決済に用いるカード変更
    changeSettleCard = (cardId) => {
        const { customerId } = this.state
        payjpAxios.post(
            'customers/' + customerId,
            qs.stringify({
                default_card: cardId
            })
        )
            .catch(e => console.error('デフォルトカードの更新に失敗しました' + e))
    }

    onPressCancel = () => {
        this.props.navigation.navigate('プランの解約', {
            defaultCard: this.state.defaultCard,
            nextBillingTime: this.state.nextBillingTime,
            subscriptionId: this.state.subscriptionId,
            currentUserEmail: this.state.currentUserEmail
        })
    }

    //新規カード追加
    onSubmit = async (value) => {
        try {
            const { customerId } = this.state
            const token = await this.payJp.createToken(value)
            //customerにカードデータを追加
            await payjpAxios.post(
                'customers/' + customerId  + '/cards',
                qs.stringify({
                    card: token.id
                })
            )
            this.toggleAddCardModal()
            this.fetchPayjpData()
        } catch(e) {
            console.log('カードの追加に失敗しました', e)
            this.setState({ isErrorAlertModalVisible: true })
        }
    }

    toggleAddCardModal = () => {
        this.setState({ isAddCardModalVisible: !this.state.isAddCardModalVisible })
    }

    toggleChangeModal = async (cardId) => {
        this.setState({
            isChangeModalVisible: !this.state.isChangeModalVisible,
            selectedCardId: cardId
        })
    }

    toggleDeleteModal = async (cardId) => {
        this.setState({
            isDeleteModalVisible: !this.state.isDeleteModalVisible,
            selectedCardId: cardId
        })
    }

    //カード削除
    deleteCard = async () => {
        this.setState({ isDeleteModalVisible: false })
        const { customerId, selectedCardId } = this.state
        try {
            const res = await payjpAxios.delete(
                'customers/' + customerId + '/cards/' + selectedCardId
            )
            this.fetchPayjpData()
        } catch(e) {
            console.error('カードの削除に失敗しました', e)
        }
    }

    //デフォルトカード変更
    changeDefaultCard = async () => {
        this.setState({ isChangeModalVisible: false })
        const { customerId, selectedCardId } = this.state
        try {
            const res = await payjpAxios.post(
                'customers/' + customerId,
                qs.stringify({
                    default_card: selectedCardId
                })
            )
            this.fetchPayjpData()
        } catch(e) {
            console.error('デフォルトカードの更新に失敗しました' + e)
        }
    }

    render() {
        const {
            otherCards,
            defaultCard,
            isErrorAlertModalVisible,
            isDeleteModalVisible,
            isChangeModalVisible,
            isAddCardModalVisible,
            nextBillingTime,
            registered,
            customerId
        } = this.state
        let defaultCardBrandLogo
        switch(defaultCard.brand) {
            case 'Visa':
                defaultCardBrandLogo = cardBrandImageUrl.visa
                break
            case 'MasterCard':
                defaultCardBrandLogo = cardBrandImageUrl.masterCard
                break
            case 'JCB':
                defaultCardBrandLogo = cardBrandImageUrl.jcb
                break
            case 'American Express':
                defaultCardBrandLogo = cardBrandImageUrl.americanExpress
                break
            case 'Diners Club':
                defaultCardBrandLogo = cardBrandImageUrl.dinersClub
                break
            case 'Discover':
                defaultCardBrandLogo = cardBrandImageUrl.discover
                break
        }
        return(
            <SafeAreaView style={{ flex: 1 }}>
                <SingleButtonModal
                    isModalVisible={isAddCardModalVisible}
                    onPressButton={this.toggleAddCardModal}
                    text='カードの登録に成功しました'
                    buttonText='閉じる'
                />
                <DoubleButtonModal
                    isModalVisible={isChangeModalVisible}
                    onPressLeftButton={this.toggleChangeModal}
                    onPressRightButton={this.changeDefaultCard}
                    text='選択したカードを次回からのお支払いに使用しますか？'
                    leftButtonText='キャンセル'
                    rightButtonText='決定'
                />
                <DoubleButtonModal
                    isModalVisible={isDeleteModalVisible}
                    onPressLeftButton={this.toggleDeleteModal}
                    onPressRightButton={this.deleteCard}
                    text='選択したカードを削除しますか？'
                    leftButtonText='キャンセル'
                    rightButtonText='決定'
                />
                <ErrorAlertModal
                    isModalVisible={isErrorAlertModalVisible}
                    onPressButton={() => this.setState({ isErrorAlertModalVisible: false })}
                    alertText={
                        <Text style={styles.errorAlertModal}>
                            <View style={styles.iconContainer}>
                                <MaterialIcon name='alert-circle' size={24} color='#A60000' />
                            </View>
                            登録できませんでした。
                        </Text>
                    }
                    text={'カード番号に誤りがあるか、\n登録できないクレジットカードです。'}
                    buttonText='やり直す'
                />
                <ScrollView>
                    <PayJpBridge
                        ref={(ref) => {
                            if(ref) {
                                this.payJp = ref
                            }
                        }}
                        publicKey={PAYJP.publickKey}
                    />
                    {registered ?
                        <Text style={styles.titleText}>現在加入中のプラン</Text>
                    :
                        <Text style={styles.titleText}>プラン詳細</Text>
                    }
                    <View style={styles.componentView}>
                        <View style={styles.innerView}>
                            <Text style={styles.planTitle}>プレタポ2ヶ月5着レンタル会員</Text>
                            <View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={styles.iconView}>
                                        <FontAwesomeIcon name='circle' size={8} color='#7389D9' />
                                    </View>
                                    <Text style={styles.planText}>5着のレンタルを開始し、2ヶ月後までに返却</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={styles.iconView}>
                                        <FontAwesomeIcon name='circle' size={8} color='#7389D9' />
                                    </View>
                                    <Text style={styles.planText}>月額4980(送料別)を毎月契約日にお支払い</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={styles.iconView}>
                                        <FontAwesomeIcon name='circle' size={8} color='#7389D9' />
                                    </View>
                                    <Text style={styles.planText}>返却時のクリーニングは不要</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={styles.iconView}>
                                        <FontAwesomeIcon name='circle' size={8} color='#7389D9' />
                                    </View>
                                    <Text style={styles.planText}>割引価格で買取申請が可能・買取した服は返却不要</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={styles.iconView}>
                                        <FontAwesomeIcon name='circle' size={8} color='#7389D9' />
                                    </View>
                                    <Text style={styles.planText}>サブスクリプションの解約は制限無し</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {registered ?
                        <View>
                            <Text style={styles.titleText}>次回のお支払い</Text>
                            <View style={styles.componentView}>
                                <View style={styles.innerView}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text>合計金額  ：</Text>
                                        <Text style={styles.feeText}>5780</Text>
                                        <Text>円</Text>
                                        <Text style={styles.dateText}>{nextBillingTime} 請求予定</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    :
                        null
                    }
                    {customerId ?
                        <View>
                            <Text style={styles.titleText}>現在お支払いに設定されているカード</Text>
                            <View style={styles.componentView}>
                                <View style={styles.innerView}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <MaterialIcon name='credit-card-outline' size={20} />
                                        <Text style={styles.cardNumberText}>**** **** **** {defaultCard.last4}</Text>
                                        <Image source={defaultCardBrandLogo} style={styles.brandImage} />
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                        <Text style={styles.cardText}>有効期限</Text>
                                        <Text style={styles.cardDataText}>{defaultCard.exp_month}/{defaultCard.exp_year}</Text>
                                    </View>
                                </View>
                            </View>
                            {otherCards.length ?
                                <Text style={styles.titleText}>その他のお支払い情報</Text>
                            :
                                null
                            }
                            {otherCards.map((card, idx) => {
                                let otherCardBrandLogo
                                switch(card.brand) {
                                    case 'Visa':
                                        otherCardBrandLogo = cardBrandImageUrl.visa
                                        break
                                    case 'MasterCard':
                                        otherCardBrandLogo = cardBrandImageUrl.masterCard
                                        break
                                    case 'JCB':
                                        otherCardBrandLogo = cardBrandImageUrl.jcb
                                        break
                                    case 'American Express':
                                        otherCardBrandLogo = cardBrandImageUrl.americanExpress
                                        break
                                    case 'Diners Club':
                                        otherCardBrandLogo = cardBrandImageUrl.dinersClub
                                        break
                                    case 'Discover':
                                        otherCardBrandLogo = cardBrandImageUrl.discover
                                        break
                                }
                                return(
                                    <View style={{ marginBottom: 20 }} key={idx}>
                                        <View style={styles.componentView}>
                                            <View style={styles.innerView}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <MaterialIcon name='credit-card-outline' size={20} />
                                                    <Text style={styles.cardNumberText}>**** **** **** {card.last4}</Text>
                                                    <Image source={otherCardBrandLogo} style={styles.brandImage} />
                                                </View>
                                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                                    <Text style={styles.cardText}>有効期限</Text>
                                                    <Text style={styles.cardDataText}>{card.exp_month}/{card.exp_year}</Text>
                                                </View>
                                                <View style={styles.otherCardButtonContainer}>
                                                    <Button
                                                        title='次からのお支払いに指定'
                                                        buttonStyle={styles.topButtonStyle}
                                                        titleStyle={styles.topTitleStyle}
                                                        onPress={() => this.toggleChangeModal(card.id)}
                                                    />
                                                    <Button
                                                        title='削除'
                                                        buttonStyle={styles.bottomButtonStyle}
                                                        titleStyle={styles.bottomTitleStyle}
                                                        onPress={() => this.toggleDeleteModal(card.id)}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })}
                            <View style={styles.componentView}>
                            </View>
                            <View style={styles.addCardView}>
                                <View>
                                    <MaterialIcon name='plus-circle-outline' size={24} color='#7389D9' />
                                </View>
                                <Text style={styles.addCardText}>新しいお支払い方法を追加</Text>
                            </View>
                            <CardForm onSubmit={this.onSubmit} />
                            <View style={{ height: 30 }}></View>
                        </View>
                    :
                        null
                    }
                    {
                        registered ?
                            <TouchableHighlight
                                style={styles.cancelView}
                                onPress={() => this.onPressCancel()}
                                underlayColor='white'
                            >
                                <View style={styles.cancelInnerView}>
                                    <Text style={styles.cancelText}>解約手続きへ進む</Text>
                                    <MaterialIcon name='chevron-right' size={24} style={styles.cancelIcon} />
                                </View>
                            </TouchableHighlight>
                        :
                            null
                    }
                    <View style={{ height: 100 }}></View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    componentView : {
        backgroundColor: 'white',
    },
    innerView: {
        margin: 30,
        marginTop: 20,
        marginBottom: 20
    },
    titleText: {
        margin: 30,
        marginBottom: 10,
        fontSize: 16
    },
    brandImage: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginTop: -4
    },
    cardNumberText: {
        marginLeft: 20,
        marginRight: 20
    },
    cardText: {
        color: 'grey',
    },
    cardDataText: {
        marginTop: -2,
        marginLeft: 10
    },
    cancelView: {
        backgroundColor: 'white',
        height: 50,
        justifyContent: 'center',
        paddingLeft: 30
    },
    cancelText: {
        fontSize: 16
    },
    addCardView: {
        margin: 30,
        marginBottom: 10,
        flexDirection: 'row'
    },
    addCardText: {
        fontSize: 16,
        marginLeft: 8,
        marginTop: 4
    },
    errorAlertModal: {
        color: '#A60000',
        margin: 13,
        fontSize: 15,
        fontWeight: '500',
        letterSpacing: 1
    },
    iconContainer: {
        marginTop: -7,
        marginRight: 5
    },
    topButtonStyle: {
        borderRadius: 60,
        height: 50,
        width: 240,
        backgroundColor: '#7389D9',
        marginBottom: hp('1%'),
    },
    topTitleStyle: {
        color: 'white',
    },
    bottomButtonStyle: {
        backgroundColor: 'white',
        height: 40,
    },
    bottomTitleStyle: {
        color: '#7389D9'
    },
    otherCardButtonContainer: {
        alignItems: 'center',
        marginTop: 20
    },
    componentView: {
        backgroundColor: 'white',
    },
    innerView: {
        margin: 30,
        marginTop: 20,
        marginBottom: 20
    },
    planTitle: {
        fontSize: 15,
        marginBottom: 15
    },
    planText: {
        fontSize: 12,
        lineHeight: 24,
        letterSpacing: 1.5
    },
    iconView: {
        marginRight: 6,
        marginTop: 8
    },
    feeText: {
        fontWeight: '500',
        marginLeft: 20,
        marginRight: 5,
        marginTop: -2
    },
    dateText: {
        position: 'absolute',
        right: 0
    },
    cancelIcon: {
        position: 'absolute',
        right: 30
    },
    cancelInnerView: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})