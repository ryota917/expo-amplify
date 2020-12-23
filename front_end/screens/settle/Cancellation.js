import React, { useState } from 'react'
import { Image, Text, StyleSheet, SafeAreaView, ScrollView, View } from 'react-native'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { payjpAxios, cardBrandImageUrl } from 'pretapo/front_end/screens/common/Payjp'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import { Button } from 'react-native-elements'
import DoubleButtonModal from 'pretapo/front_end/screens/common/DoubleButtonModal'
import SingleButtonModal from 'pretapo/front_end/screens/common/SingleButtonModal'
import { API, graphqlOperation } from 'aws-amplify'
import * as gqlMutations from 'pretapo/src/graphql/mutations'

export const Cancellation = (props) => {
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false)
    const [isThankModalVisible, setIsThankModalVisible] = useState(false)
    const [isConfirmed, setIsConfirmed] = useState(false)
    const nextBillingTime = props.navigation.state.params.nextBillingTime
    const defaultCard = props.navigation.state.params.defaultCard
    const subscriptionId = props.navigation.state.params.subscriptionId
    const currentUserEmail = props.navigation.state.params.currentUserEmail

    const toggleConfirmModal = async () => {
        setIsConfirmModalVisible(prevState => !prevState)
    }

    const goHomePage  = () => {
        setIsThankModalVisible(false)
        setIsConfirmed(false)
        props.navigation.navigate("SettleEditPage")
    }

    const cancelConfirm = async () => {
        try {
            const res = await payjpAxios.post('subscriptions/' + subscriptionId + '/cancel')
            console.log('サブスクリプションを解約しました', res)
            await API.graphql(graphqlOperation(gqlMutations.updateUser, {
                input: {
                    id: currentUserEmail,
                    registered: false
                }
            }))
            setIsConfirmed(true)
            toggleConfirmModal()
        } catch(e) {
            console.error('解約処理中にエラーが発生しました', e)
        }
    }

    const showThankModal = () => {
        if(isConfirmed) {
            setIsThankModalVisible(true)
        }
    }

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
            <ScrollView>
                <DoubleButtonModal
                    isModalVisible={isConfirmModalVisible}
                    onPressLeftButton={toggleConfirmModal}
                    onPressRightButton={cancelConfirm}
                    text={'登録しているサブスクリプションのサービスが利用できなくなります。\n解約しますか？'}
                    leftButtonText='戻る'
                    rightButtonText='進む'
                    onModalHide={showThankModal}
                />
                <SingleButtonModal
                    isModalVisible={isThankModalVisible}
                    onPressButton={goHomePage}
                    text={'ご利用ありがとうございました。\nまたのご利用をお待ちしております。'}
                    buttonText='ホーム画面へ'
                />
                <Text style={styles.titleText}>現在加入中のプラン</Text>
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
                    <View style={{ height: 30 }}></View>
                    <Text style={styles.titleText}>お支払い方法</Text>
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
            </ScrollView>
            <View style={styles.cancelButtonView}>
                <Button
                    title='確定する →'
                    buttonStyle={styles.cancelButtonStyle}
                    titleStyle={styles.cancelTitleStyle}
                    onPress={toggleConfirmModal}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
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
    titleText: {
        fontSize: 16,
        margin: 30,
        marginBottom: 10
    },
    cardText: {
        color: 'grey',
    },
    cardDataText: {
        marginTop: -2,
        marginLeft: 10
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
    cancelButtonView: {
        position: 'absolute',
        right: wp('6%'),
        bottom: hp('4%'),
        shadowColor: 'black',
        shadowOffset: { width: 10, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 80
    },
    cancelButtonStyle: {
        backgroundColor: 'white',
        borderRadius: 40,
        width: wp('50%'),
        height: hp('8%'),
        color: 'white'
    },
    cancelTitleStyle: {
        color: '#7389D9',
        fontSize: 16,
        fontWeight: 'bold'
    },
})