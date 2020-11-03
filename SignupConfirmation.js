import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { Auth, formContainer } from 'aws-amplify';
import { Input, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Modal from 'react-native-modal'

export default class Signin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            verificationCode: '',
            isResendConfimationModalVisile: false,
            isSendedModalVisible: false,
            isConfirmPressed: false,
            confirmationAlert: false
        }
    }

    navigateSignIn = () => {
        this.props.onStateChange('signIn')
    }

    onPressConfirmationSignup = async () => {
        const { verificationCode } = this.state
        const { email } = this.props.authData
        console.log(email)
        console.log(verificationCode)
        try{
            await Auth.confirmSignUp(email, verificationCode)
            this.props.onStateChange('confirmSignIn', { verificationCode })
        } catch(error) {
            console.error(error)
            this.setState({ confirmationAlert: true })
            setTimeout(() => this.setState({ confirmationAlert: false }), 3000)
        }
    }

    onPressResendConfirmationMail = async () => {
        const email = this.props.authData
        try {
            this.toggleResendConfirmationModal()
        } catch(err) {
            console.error(err)
        }
    }

    toggleResendConfirmationModal = () => {
        this.setState({ isResendConfimationModalVisile: !this.state.isResendConfimationModalVisile })
    }

    toggleResendConfirmationModalWithConfirmed = () => {
        this.setState({
            isResendConfimationModalVisile: !this.state.isResendConfimationModalVisile,
            isConfirmPressed: true
        })
    }

    showSendedModal = () => {
        if(this.state.isConfirmPressed) {
            this.setState({ isSendedModalVisible: true })
        }
    }

    hideSendedModal = () => {
        this.setState({
            isSendedModalVisible: false,
            isConfirmPressed: false
        })
    }

    render() {
        if(this.props.authState !== 'confirmSignUp') {
            return null;
        } else {
            return(
                <View style={styles.container}>
                    <Modal
                        isVisible={this.state.isResendConfimationModalVisile}
                        onModalHide={() => this.showSendedModal()}
                        onBackdropPress={() => this.toggleResendConfirmationModal()}
                    >
                        <View style={styles.modalContainerView}>
                            <View style={styles.modalInnerView}>
                                <Text style={styles.modalText}>確認コードを再送信しますか？</Text>
                                <View style={styles.modalButtonView}>
                                    <Button
                                        title='戻る'
                                        onPress={() => this.toggleResendConfirmationModal()}
                                        buttonStyle={{ borderRadius: 25, width: wp('25%'), height: hp('6%'), backgroundColor: '#333333' }}
                                        titleStyle={{ fontSize: 14, color: 'white' }}
                                    />
                                    <Button
                                        title='再送信'
                                        onPress={() => this.toggleResendConfirmationModalWithConfirmed()}
                                        buttonStyle={{ marginLeft: wp('3%'), borderRadius: 25, width: wp('25%'), height: hp('6%'), backgroundColor: '#7389D9' }}
                                        titleStyle={{ fontSize: 14, color: 'white' }}
                                    />
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        isVisible={this.state.isSendedModalVisible}
                    >
                        <View style={styles.modalContainerView}>
                            <View style={styles.modalInnerView}>
                                <Text style={styles.modalText}>確認コードを再送信しました。{"\n"}メールが届くまで数分程度{"\n"}かかる可能性があります。</Text>
                                <View style={styles.modalButtonView}>
                                    <Button
                                        title='コード入力'
                                        onPress={() => this.hideSendedModal()}
                                        buttonStyle={{ marginLeft: wp('3%'), borderRadius: 25, width: wp('25%'), height: hp('6%'), backgroundColor: '#7389D9' }}
                                        titleStyle={{ fontSize: 14, color: 'white' }}
                                    />
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <View style={styles.header}>
                        <Icon name='chevron-left' size={30} onPress={this.navigateSignIn}/>
                        <Text style={styles.headerText}>確認コード入力</Text>
                    </View>
                    <View style={styles.innerContainer}>
                        <View style={styles.formContainer}>
                            {/* アラートView */}
                            <View style={{ flexDirection: 'row', marginBottom: hp('3%'), display: this.state.confirmationAlert ? 'block' : 'none' }}>
                                <Icon name='alert-circle' size={17} style={{ color: '#A60000' }} />
                                <Text style={{ marginLeft: wp('2%'), color: '#A60000' }}>認証に失敗しました</Text>
                            </View>
                            <View style={styles.formView}>
                                <Input onChangeText={val => this.setState({ verificationCode: val })} />
                            </View>
                        </View>
                        <View style={styles.resendButtonView}>
                            <Button
                                title='確認コードを再送する'
                                buttonStyle={{ backgroundColor: 'transparent', marginLeft: wp('30%'), marginTop: hp('3%') }}
                                titleStyle={{ color: 'silver', fontSize: 16, textDecorationLine: 'underline' }}
                                onPress={this.toggleResendConfirmationModal}
                            />
                        </View>
                    </View>
                    <View style={styles.confirmButtonView}>
                        <Button
                            title='確認 →'
                            buttonStyle={{ borderRadius: 30, width: wp('30%'), height: hp('6%'), backgroundColor: 'white' }}
                            titleStyle={{ color: '#7389D9', fontSize: 16, fontWeight: 'bold' }}
                            onPress={this.onPressConfirmationSignup}
                        />
                    </View>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        width: wp('100%'),
        height: hp('100%')
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        left: wp('7%'),
        top: wp('3%'),
        height: hp('8%')
    },
    headerText: {
        fontSize: 18,
        marginLeft: wp('23%')
    },
    innerContainer: {
        width: wp('80%'),
        height: hp('100%'),
        left: wp('10%'),
        top: hp('30%')
    },
    formContainer: {
    },
    formView: {
    },
    resendButtonView: {

    },
    confirmButtonView: {
        flex: 1,
        position: 'absolute',
        bottom: hp('10%'),
        right: wp('8%'),
        shadowColor: 'black',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        borderRadius: 30,
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
        fontWeight: '500'
    },
    modalButtonView: {
        flexDirection: 'row'
    },
})