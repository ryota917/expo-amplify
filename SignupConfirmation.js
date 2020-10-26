import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { Auth, formContainer } from 'aws-amplify';
import { Input, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'


export default class Signin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            verificationCode: ''
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
            //多分この後ログイン画面に遷移して再度ログインしないとログインが完了しない(confirmSignin)
            this.props.onStateChange('confirmSignIn', verificationCode)
        } catch(error) {
            console.error(error)
        }
    }

    onPressResendSignUp = async () => {
        const email = this.props.authData
        try {
            const resend = await Auth.resendSignUp(email)
            console.log(resend)
            //再度確認メールを送信したことを通知するアクション
        } catch(err) {
            console.error(err)
        }
    }

    render() {
        if(this.props.authState !== 'confirmSignUp') {
            return null;
        } else {
            return(
                <View style={styles.container}>
                    <View style={styles.innerContainer}>
                        <View style={styles.header}>
                            <Icon name='angle-left' size={50} onPress={this.navigateSignIn}/>
                            <Text>確認コード入力</Text>
                        </View>
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
                                onPress={this.onPressResendSignUp}
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
    innerContainer: {
        width: wp('70%'),
        height: hp('100%'),
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
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
    }
})