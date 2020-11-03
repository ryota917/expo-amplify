import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { Auth, formContainer } from 'aws-amplify';
import { Input, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'


export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            verificationCode: '',
            newPassword: ''
        }
    }

    navigateSignin = () => {
        this.props.onStateChange('signIn')
    }

    onPressResetPassword = async () => {
        const { verificationCode, newPassword } = this.state
        const email = this.props.authData
        try {
            const resetPassword = await Auth.forgotPasswordSubmit(
                email,
                verificationCode,
                newPassword
            )
            console.log(resetPassword)
            this.props.onStateChange('signIn')
        } catch(err) {
            console.error(err)
        }
    }

    // onPressResendConfirmationmail = async () => {
    // }

    render() {
        if(this.props.authState !== 'requireNewPassword') {
            return null;
        } else {
            return(
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Icon name='angle-left' size={30} onPress={this.navigateSignin}/>
                        <Text style={styles.headerText}>新しいパスワードの設定</Text>
                    </View>
                    <View style={styles.innerContainer}>
                        <View>
                            <View style={styles.formView}>
                                <Text style={styles.formText}>確認コード</Text>
                                <Input
                                    onChangeText={val => this.setState({ verificationCode: val })}
                                />
                            </View>
                            {/* <View> */}
                                {/* <Button */}
                                    {/* onPress={this.onPressResendConfirmationmail} */}
                                {/* /> */}
                            {/* </View> */}
                            <View style={styles.formView}>
                                <Text style={styles.formText}>新しいパスワード</Text>
                                <Input
                                    onChangeText={val => this.setState({ newPassword: val })}
                                    secureTextEntry={true}
                                />
                            </View>
                            <View>
                                <Button
                                    title='設定'
                                    buttonStyle={{ backgroundColor: '#7389D9', borderRadius: 30, height: hp('7%') }}
                                    onPress={this.onPressResetPassword}
                                />
                            </View>
                        </View>
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
        marginLeft: wp('16%'),
    },
    innerContainer: {
        width: wp('70%'),
        height: hp('100%'),
        left: wp('12%'),
        top: hp('4%')
    },
    formView: {

    },
    formText: {
    }
})