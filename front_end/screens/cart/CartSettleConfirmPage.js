import React from 'react'
import { Image, StyleSheet, Text, ScrollView, SafeAreaView, View, Platform } from 'react-native'
import { Button } from 'react-native-elements'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { payjpAxios, cardBrandImageUrl } from 'pretapo/front_end/screens/common/Payjp'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import DoubleButtonModal from 'pretapo/front_end/screens/common/DoubleButtonModal'
import DoubleButtonImageModal from '../common/DoubleButtonImageModal'
import qs from 'qs'
import { API, graphqlOperation, Auth } from 'aws-amplify'
import * as gqlMutations from 'pretapo/src/graphql/mutations'

export class CartSettleConfirmPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customer: JSON.parse(this.props.navigation.state.params.customer['request']['_response']),
            defaultCard: this.getDefaultCardData(this.props.navigation.state.params.customer),
            isConfirmModalVisible: false,
            isRegisteredModalVisible: false,
            //モーダル連続表示フラグ
            isConfirmed: false,
            currentUserEmail: '',
        }
    }

    getDefaultCardData = (res) => {
        const customer = JSON.parse(res['request']['_response'])
        const defaultCardId = customer['default_card']
        const defaultCard = customer['cards']['data'].find(card => card.id === defaultCardId)
        return defaultCard
    }

    static navigationOptions = ({ navigation: { navigate } }) => ({
        title: 'お支払いと登録の確認',
        headerLeft:() => <MaterialIcon name="chevron-left" size={Platform.isPad ? 60 : 42} onPress={() => { navigate('CartTab') }} />,
        headerStyle: {
            height: hp('7%')
        }
    });

    componentDidMount = () => {
        this.fetchCurrentUser()
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

    //サブスクリプション作成(レンタル確定?)
    createSubscription = async () => {
        const { customer, currentUserEmail } = this.state
        try {
            //Customerに紐付くSubscriptionがない場合作成、一ヶ月以内にキャンセルしている場合は再開
            if(customer.subscriptions?.data?.length) {
                const subscriptionId = customer.subscriptions.data[0].id
                const res = await payjpAxios.post('subscriptions/' + subscriptionId + '/resume')
                console.log('キャンセル済みのサブスクリプションを再開しました', res)
            } else {
                const res = await payjpAxios.post(
                    'subscriptions',
                    qs.stringify({
                        customer: customer.id,
                        plan: 'plan_standard'
                    })
                )
                console.log('新規サブスクリプションが作成されました', res)
            }
            await API.graphql(graphqlOperation(gqlMutations.updateUser, {
                input: {
                    id: currentUserEmail,
                    registered: true
                }
            }))
            this.confirmRegister()
        } catch(e) {
            console.error('サブスクリプションの作成に失敗しました', e)
        }
    }

    //サンキューモーダル非表示にしてConfirmPageへ遷移
    navigateConfirmPage = () => {
        this.setState({
            isRegisteredModalVisible: false,
            isConfirmed: false
        })
        this.props.navigation.navigate('ConfirmPage', { itemCart: this.props.navigation.state.params.itemCart })
    }

    //モーダル開閉
    toggleConfirmModal = () => {
        this.setState({ isConfirmModalVisible: !this.state.isConfirmModalVisible })
    }

    //登録確定ボタン押下時モーダルアクション
    confirmRegister = () => {
        this.setState({
            isConfirmed: true,
            isConfirmModalVisible: false
        })
    }

    //サンキューモーダル表示
    showRegisteredModal = () => {
        if(this.state.isConfirmed) {
            this.setState({ isRegisteredModalVisible: true })
        }
    }

    render() {
        const {
            defaultCard,
            isConfirmModalVisible,
            isRegisteredModalVisible
        } = this.state
        let brandLogoSource
        switch(defaultCard.brand) {
            case 'Visa':
                brandLogoSource = cardBrandImageUrl.visa
                break
            case 'MasterCard':
                brandLogoSource = cardBrandImageUrl.masterCard
                break
            case 'JCB':
                brandLogoSource = cardBrandImageUrl.jcb
                break
            case 'American Express':
                brandLogoSource = cardBrandImageUrl.americanExpress
                break
            case 'Diners Club':
                brandLogoSource = cardBrandImageUrl.dinersClub
                break
            case 'Discover':
                brandLogoSource = cardBrandImageUrl.discover
                break
        }
        return(
            <SafeAreaView style={{ flex: 1 }}>
                <DoubleButtonModal
                    isModalVisible={isConfirmModalVisible}
                    onPressLeftButton={this.toggleConfirmModal}
                    onPressRightButton={this.createSubscription}
                    text={'サブスクリプションに登録して初回のお支払いを行います'}
                    leftButtonText='戻る'
                    rightButtonText='進む'
                    onModalHide={this.showRegisteredModal}
                />
                <DoubleButtonImageModal
                    isModalVisible={isRegisteredModalVisible}
                    onPressLeftButton={this.navigateConfirmPage}
                    bigText={'登録ありがとうございます！'}
                    smallText={'あなたのファッションが私たちのレンタルでより楽しいものになりますように。'}
                    image={require('pretapo/assets/register.png')}
                    leftButtonText='選んだ服のお届けに進む'
                />
                <ScrollView>
                    <Text style={styles.titleText}>加入プラン(サブスクリプション)</Text>
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
                    <Text style={styles.titleText}>初回のお支払額</Text>
                    <View style={styles.componentView}>
                        <View style={styles.innerView}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.payText}>プレタポ2ヶ月5着レンタル会員費</Text>
                                <Text style={styles.feeText}>4980</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.payText}>レンタル初月 送料</Text>
                                <Text style={styles.feeText}>800</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.payText}>消費税</Text>
                                <Text style={styles.feeText}>560</Text>
                            </View>
                            <View style={styles.line}></View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.payText}>合計金額</Text>
                                <Text style={styles.feeSumText}>5780円</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.titleText}>お支払い方法</Text>
                    <View style={styles.componentView}>
                        <View style={styles.innerView}>
                            <View style={{ flexDirection: 'row' }}>
                                <MaterialIcon name='credit-card-outline' size={20} />
                                <Text style={styles.cardNumberText}>**** **** **** {defaultCard.last4}</Text>
                                <Image source={brandLogoSource} style={styles.brandImage} />
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Text style={styles.cardText}>有効期限</Text>
                                <Text style={styles.cardDataText}>{defaultCard.exp_month}/{defaultCard.exp_year}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ height: 150 }}></View>
                </ScrollView>
                <View style={styles.confirmButtonView}>
                    <Button
                        title='確定する →'
                        buttonStyle={styles.confirmButtonStyle}
                        titleStyle={styles.confirmTitleStyle}
                        onPress={() => this.toggleConfirmModal()}
                    />
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    componentView : {
        backgroundColor: 'white',
    },
    titleText: {
        fontSize: 16,
        margin: 30,
        marginBottom: 10
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
    payText: {
        fontSize: 12,
        lineHeight: 24,
        letterSpacing: 1
    },
    feeText: {
        fontSize: 12,
        marginTop: 5,
        position: 'absolute',
        right: 0
    },
    feeSumText: {
        marginTop: 5,
        position: 'absolute',
        right: 0,
        fontWeight: '600'
    },
    line: {
        borderWidth: 0.5,
        borderColor: 'silver',
        marginTop: 15,
        marginBottom: 15
    },
    cardText: {
        color: 'grey',
        // marginTop: 10
    },
    cardDataText: {
        marginTop: -2,
        marginLeft: 10
    },
    cardNumberText: {
        marginLeft: 20,
        marginRight: 20
    },
    confirmButtonView: {
        position: 'absolute',
        right: wp('6%'),
        bottom: hp('4%'),
        shadowColor: 'black',
        shadowOffset: { width: 10, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 80
    },
    confirmButtonStyle: {
        backgroundColor: 'white',
        borderRadius: 40,
        width: wp('50%'),
        height: hp('8%'),
        color: 'white'
    },
    confirmTitleStyle: {
        color: '#7389D9',
        fontSize: 16,
        fontWeight: 'bold'
    },
    brandImage: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginTop: -4
    }
})