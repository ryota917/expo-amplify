import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { Auth } from 'aws-amplify';
import Signup from './Signup'
import { Loading } from 'aws-amplify-react-native'
import { Input, Button } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Modal from 'react-native-modal'

export default class Signin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isForgotPasswordModalVisible: false
        }
    }

    onPressSignin = async () => {
        const { email, password } = this.state
        try {
            const user = await Auth.signIn(email, password)
            console.log('successfully logined!')
            console.log(user)
        } catch(error) {
            console.log('error signing in ', error)
        }
    }

    onPressConfirmSignin = async () => {
        const { email, password } = this.state
        const verificationCode = this.props.authData
        try{
            const userData = await Auth.signIn(email, password)
            const confirmUser = await Auth.confirmSignIn(userData, verificationCode)
            console.log(confirmUser)
        } catch(err) {
            console.error(err)
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
        if(this.props.authState !== 'signIn' && this.props.authState !== 'confirmSignIn') {
            return null;
        } else {
            return(
                <View style={styles.container}>
                    <Modal isVisible={this.state.isForgotPasswordModalVisible}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>パスワードの再発行を行いますか？</Text>
                            <View style={styles.modalButtonView}>
                                <Button
                                    title='戻る'
                                    onPress={this.toggleModal}
                                    buttonStyle={{}}
                                    titleStyle={{}}
                                />
                                <Button
                                    title='再発行へ'
                                    onPress={this.navigateForgotPassword}
                                    buttonStyle={{}}
                                    titleStyle={{}}
                                />
                            </View>
                        </View>
                    </Modal>
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.formContainer}>
                            <View>
                                <View style={styles.login}>
                                    <Text style={styles.loginText}>Log in</Text>
                                </View>
                                <View style={styles.form}>
                                    <Text style={styles.formText}>メールアドレス</Text>
                                    <Input
                                        onChangeText={val => this.setState({ email: val })}
                                    />
                                </View>
                                <View style={styles.form}>
                                    <Text style={styles.formText}>パスワード</Text>
                                    <Input
                                        onChangeText={val => this.setState({ password: val })}
                                        secureTextEntry={true}
                                    />
                                </View>
                                <View style={styles.toForgotPassworButton}>
                                    <Button
                                        title='パスワードを忘れた方はこちら'
                                        onPress={this.toggleModal}
                                        buttonStyle={{ backgroundColor: 'white'}}
                                        titleStyle={{ color: '#7389D9', fontWeight: 'bold', fontSize: 16 }}
                                    />
                                </View>
                                <View style={styles.toSignupButton}>
                                    <Button
                                        title='アカウントをお持ちでない方はこちら'
                                        onPress={this.navigateSignup}
                                        buttonStyle={{ backgroundColor: 'white'}}
                                        titleStyle={{ color: '#7389D9', fontWeight: 'bold', fontSize: 16 }}
                                    />
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    <View style={styles.nextButton}>
                        <Button
                            title='next →'
                            buttonStyle={{ borderRadius: 30, width: wp('30%'), height: hp('6%'), backgroundColor: 'white' }}
                            titleStyle={{ color: '#7389D9', fontSize: 16, fontWeight: 'bold' }}
                            onPress={(this.props.authState === 'signIn') ? this.onPressSignin : this.onPressConfirmSignin}
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
        height: hp('100%'),
        top: hp('5%')
        //justifyContent: 'center'
    },
    modalView: {
        backgroundColor: 'white',
        width: wp('70%'),
        height: hp('30%'),
        left: wp('10%'),
        //alignItems: 'center',
        borderRadius: 15
    },
    modalText: {

    },
    modalButtonView: {
        flexDirection: 'row'
    },
    scrollView: {
        flex: 1,
        width: wp('100%'),
    },
    formContainer: {
        width: wp('90%'),
        alignItems: 'center',
        height: wp('100%'),
        justifyContent: 'center'
    },
    login: {
    },
    loginText: {
        width: wp('40%'),
        fontSize: wp('10%'),
        fontWeight: '500'
    },
    form: {
        marginTop: wp('4%')
    },
    formText: {
        fontSize: 16
    },
    toForgotPassworButton: {

    },
    toSignupButton: {
        marginTop: wp('4%')
    },
    nextButton: {
        flex: 1,
        position: 'absolute',
        bottom: hp('14%'),
        right: wp('8%'),
        shadowColor: 'black',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        borderRadius: 30,
    }
})