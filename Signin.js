import React from 'react'
import { TextInput, StyleSheet, Image, Text, View, ScrollView, SafeAreaView } from 'react-native'
import { Auth } from 'aws-amplify';
import { Button } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Modal from 'react-native-modal'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class Signin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputedEmail: '',
            inputedPassword: '',
            isForgotPasswordModalVisible: false,
            alert: false
        }
    }

    componentDidMount = () => {
        this.setState({ alert: false })
    }

    onPressSignin = async () => {
        const { inputedEmail, inputedPassword } = this.state
        try {
            const user = await Auth.signIn(inputedEmail, inputedPassword)
            console.log('successfully logined!')
            console.log(user)
        } catch(error) {
            console.error(error)
            if(error.code === 'UserNotConfirmedException') {
                Auth.resendSignUp(inputedEmail)
                this.props.onStateChange('confirmSignUp', { email: inputedEmail })
            } else {
                this.setState({ alert: true })
                setTimeout(() => this.setState({ alert: false }), 3000)
            }
        }
    }

    onPressConfirmSignin = async () => {
        console.log(this.props.authData)
        const { inputedEmail, inputedPassword } = this.state
        const { authData, verificationCode } = this.props.authData
        try{
            await Auth.signIn(inputedEmail, inputedPassword)
        } catch(err) {
            console.error(err)
            this.setState({ alert: true })
            setTimeout(() => this.setState({ alert: false }), 3000)
        }
    }

    navigateSignup = () => {
        this.props.onStateChange('signUp', 'testtest')
    }

    navigateForgotPassword = () => {
        this.props.onStateChange('forgotPassword')
        this.toggleModal()
    }

    toggleModal = () => {
        this.setState({ isForgotPasswordModalVisible: !this.state.isForgotPasswordModalVisible })
    }


    render() {
        if(true) {
            return null;
        } else {
            return(
                    <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.container}>
                        <Modal isVisible={this.state.isForgotPasswordModalVisible}>
                            <View style={styles.modalContainerView}>
                                <View style={styles.modalInnerView}>
                                    <Text style={styles.modalText}>パスワードの再発行を{'\n'}行いますか？</Text>
                                    <View style={styles.modalButtonView}>
                                        <Button
                                            title='戻る'
                                            onPress={this.toggleModal}
                                            buttonStyle={styles.modalLeftButtonStyle}
                                            titleStyle={styles.modalLeftTitleStyle}
                                        />
                                        <Button
                                            title='再発行へ'
                                            onPress={this.navigateForgotPassword}
                                            buttonStyle={styles.modalRightButtonStyle}
                                            titleStyle={styles.modalRightTitleStyle}
                                        />
                                    </View>
                                </View>
                            </View>
                        </Modal>
                        <ScrollView style={styles.scrollView}>
                            <View style={styles.formContainer}>
                                <View>
                                    <Image source={require('./assets/login.png')} style={styles.loginTextImage} />
                                    {/* アラートView */}
                                    <View style={styles.alertView}>
                                        <Icon name='alert-circle' size={17} style={[styles.alertIcon, { display: this.state.alert ? 'block' : 'none' }]} />
                                        <Text style={[styles.alertText, { display: this.state.alert ? 'flex' : 'none' }]}>ログインに失敗しました</Text>
                                    </View>
                                    <View style={styles.form}>
                                        <Text style={styles.formText}>メールアドレス</Text>
                                        <TextInput
                                            onChangeText={val => this.setState({ inputedEmail: val })}
                                            style={styles.textInput}
                                        />
                                    </View>
                                    <View style={styles.form}>
                                        <Text style={styles.formText}>パスワード</Text>
                                        <TextInput
                                            onChangeText={val => this.setState({ inputedPassword: val })}
                                            secureTextEntry={true}
                                            style={styles.textInput}
                                        />
                                    </View>
                                    <View style={styles.forgotPasswordView}>
                                        <Icon.Button
                                            name='alert-circle'
                                            backgroundColor='white'
                                            iconStyle={styles.forgotPasswordIcon}
                                            onPress={() => this.toggleModal()}
                                        >
                                            <Text style={styles.forgotPasswordButton}>パスワードを忘れた方はこちら</Text>
                                        </Icon.Button>
                                    </View>
                                    <View style={styles.toSignupButton}>
                                        <Button
                                            title='アカウントをお持ちでない方はこちら'
                                            onPress={this.navigateSignup}
                                            buttonStyle={{ backgroundColor: 'white'}}
                                            titleStyle={styles.signUpButtonStyle}
                                        />
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                        <View style={styles.nextButtonView}>
                            <Button
                                title='next →'
                                buttonStyle={styles.nextButtonStyle}
                                titleStyle={styles.nextTitleStyle}
                                onPress={(this.props.authState === 'signIn') ? this.onPressSignin : this.onPressConfirmSignin}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        width: wp('100%'),
        height: hp('100%'),
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
    modalLeftButtonStyle: {
        borderRadius: 30,
        width: wp('25%'),
        height: hp('7%'),
        backgroundColor: '#333333'
    },
    modalLeftTitleStyle: {
        fontSize: 14,
        color: 'white',
    },
    modalRightButtonStyle: {
        marginLeft: wp('3%'),
        borderRadius: 30,
        width: wp('25%'),
        height: hp('7%'),
        backgroundColor: '#7389D9'
    },
    modalRightTitleStyle: {
        fontSize: 14,
        color: 'white'
    },
    loginTextImage: {
        marginTop: hp('27%'),
        width: wp('35%'),
        height: wp('14%'),
        resizeMode: 'contain',
    },
    formContainer: {
        width: wp('80%'),
        left: wp('10%'),
        height: wp('100%'),
        justifyContent: 'center',
    },
    loginText: {
        width: wp('40%'),
        fontSize: wp('10%'),
        fontWeight: '500',
        marginBottom: hp('3%'),
    },
    form: {
        marginTop: wp('12%'),
    },
    formText: {
        fontSize: 14,
        color: 'silver',
    },
    toSignupButton: {
        marginTop: wp('8%')
    },
    nextButtonView: {
        position: 'absolute',
        bottom: hp('12%'),
        right: wp('10%'),
        shadowColor: 'black',
        shadowOffset: { width: 10, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        borderRadius: 30,
    },
    nextButtonStyle: {
        borderRadius: 50,
        width: wp('42%'),
        height: hp('8%'),
        backgroundColor: 'white'
    },
    nextTitleStyle: {
        color: '#7389D9',
        fontSize: 18,
        fontWeight: 'bold'
    },
    forgotPasswordView: {
        marginTop: hp('1%'),
        marginLeft: -wp('2.5%')
    },
    forgotPasswordButton: {
        color: 'silver',
        fontSize: 13,
        fontWeight: '400',
        marginTop: hp('0.3%')
    },
    forgotPasswordIcon: {
        color: 'silver',
        marginTop: hp('0.3%')
    },
    signUpButtonStyle: {
        color: '#7389D9',
        fontWeight: '800',
        fontSize: 15,
        letterSpacing: 1.2,
        marginLeft: -wp('2%')
    },
    textInput: {
        borderBottomColor: 'silver',
        borderBottomWidth: 1.3,
        marginTop: hp('3%'),
        fontSize: 20
    },
    alertView: {
        flexDirection: 'row',
        height: hp('3%'),
        top: hp('5%')
    },
    alertIcon: {
        color: '#A60000'
    },
    alertText: {
        marginLeft: wp('2%'),
        marginTop: 1.2,
        color: '#A60000',
        fontWeight: '500'
    }
})