import React from 'react'
import { View, Text, SafeAreaView, ScrollView, StyleSheet, TextInput, Platform } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { API, graphqlOperation, Auth } from 'aws-amplify';
import * as gqlQueries from 'pretapo/src/graphql/queries' // read
import * as gqlMutations from 'pretapo/src/graphql/mutations'
import { PAYJP, payjpAxios } from 'pretapo/front_end/screens/common/Payjp'
import qs from 'qs'
import PayJpBridge from './PayJpBridge';
import ErrorAlertModal from 'pretapo/front_end/screens/common/ErrorAlertModal'
import { CardForm } from './CardForm'

export class CartSettleEditPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isErrorAlertModalVisible: false,
            currentUserEmail: ''
        }
    }

    static navigationOptions = ({ navigation: { navigate } }) => ({
        title: '決済情報の編集',
        headerLeft:() => <MaterialIcon name="chevron-left" size={Platform.isPad ? 60 : 42} onPress={() => { navigate('CartTab') }} />,
        headerStyle: {
            height: hp('7%')
        }
    });

    componentDidMount = async () => {
        this.fetchCurrentUser()
    }

    //ログインユーザー情報
    fetchCurrentUser = async () => {
        try {
            const currentUser = await Auth.currentAuthenticatedUser()
            const currentUserEmail = currentUser.attributes.email
            this.setState({ currentUserEmail: currentUserEmail })
        } catch(err) {
            console.error(err)
        }
    }

    //カード情報登録ボタン
    //トークン作成に失敗または、トークン情報をもとに顧客作成に失敗するとエラーモーダルを返す
    onSubmit = async (value) => {
        try {
            console.log('カードデータを元にトークンを作成します。card: ', value)
            const token = await this.payJp.createToken(value)
            console.log('トークンの作成に成功しました', token)
            const tokenId = token['id']
            const customer = await this.createCustomer(tokenId)
            this.props.navigation.navigate('CartSettleConfirmPage', { customer: customer, itemCart: this.props.navigation.state.params.itemCart })
        } catch(e) {
            console.log('トークン作成に失敗しました', e)
            this.setState({ isErrorAlertModalVisible: true })
        }
    }

    //トークンを引数に顧客データを作成
    //@params {object} token
    //@returns {object} customer
    createCustomer = async (tokenId) => {
        console.log('トークンを元に顧客データを作成します')
        const res = await payjpAxios.post(
            'customers',
            qs.stringify({
                email: this.state.currentUserEmail,
                card: tokenId
            })
        ).catch(e => console.log('顧客データの作成に失敗しました error:', e))
        console.log('顧客データの作成に成功しました customer:', res)
            const customerId = JSON.parse(res['request']['_response'])['id']
            //customerIdをUserデータに保存
            API.graphql(graphqlOperation(gqlMutations.updateUser, {
                input: {
                    id: this.state.currentUserEmail,
                    customerId: customerId
                }
            }))
            this.setState({ customerId: customerId })
        return res
    }


    render() {
        const { isErrorAlertModalVisible } = this.state

        return(
            <SafeAreaView style={{ flex: 1 }}>
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
                        publicKey={PAYJP.publicKey}
                    />
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
                    <View>
                        <View style={styles.addCardView}>
                            <View>
                                <MaterialIcon name='plus-circle-outline' size={24} color='#7389D9' />
                            </View>
                            <Text style={styles.addCardText}>新しいお支払い方法を追加</Text>
                        </View>
                        <CardForm onSubmit={this.onSubmit} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: '#7389D9'
    },
    titleStyle: {
        color: 'white'
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
    componentView: {
        backgroundColor: 'white',
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
    addCardView: {
        margin: 30,
        marginBottom: 10,
        flexDirection: 'row'
    },
    addCardText: {
        fontSize: 16,
        marginLeft: 8,
        marginTop: 4
    }
})