import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { Auth, formContainer } from 'aws-amplify';
import { Input, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Modal from 'react-native-modal'

export default class Signin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            verificationCode: '',
            isResendConfimationModalVisile: false,
            isSendedModalVisible: false,
            isConfirmPressed: false
        }
    }

    navigateSignIn = () => {
        this.props.onStateChange('signIn')
    }

    onPressConfirmationSignup = async () => {
        const { verificationCode } = this.state
        const email = this.props.authData
        try{
            const auth = await Auth.confirmSignUp(email, verificationCode)
            console.log(auth)
            this.props.onStateChange('confirmSignIn', verificationCode)
        } catch(error) {
            console.error(error)
        }
    }

    onPressResendConfirmationMail = async () => {
        const email = this.props.authData
        try {
            //const resend = await Auth.resendSignUp(email)
            //console.log(resend)
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
                        <Icon name='angle-left' size={50} onPress={this.navigateSignIn}/>
                        <Text style={styles.headerText}>確認コード入力</Text>
                    </View>
                    <View style={styles.innerContainer}>
                        <View style={styles.formContainer}>
                            <View style={styles.formView}>
                                <Input onChangeText={val => this.setState({ verificationCode: val })} />
                            </View>
                        </View>
                        <View style={styles.resendButtonView}>
                            <Button
                                title='確認コードを再送する'
                                buttonStyle={{}}
                                titleStyle={{}}
                                onPress={this.toggleResendConfirmationModal}
                            />
                        </View>
                    </View>
                    <View style={styles.confirmButtonView}>
                        <Button
                            title='確認'
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
        marginLeft: wp('5%')
    },
    innerContainer: {
        width: wp('70%'),
        height: hp('100%'),
        left: wp('12%'),
        top: hp('4%')
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
        bottom: hp('4%'),
        right: wp('8%'),
        shadowColor: 'black',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.6,
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