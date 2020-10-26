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
                <View>
                    <View>
                        <View style={styles.header}>
                            <Icon name='angle-left' size={50} onPress={this.navigateSignin}/>
                            <Text>新しいパスワードの設定</Text>
                        </View>
                        <View>
                            <View>
                                <Text>確認コード</Text>
                                <Input
                                    onChangeText={val => this.setState({ verificationCode: val })}
                                />
                            </View>
                            {/* <View> */}
                                {/* <Button */}
                                    {/* onPress={this.onPressResendConfirmationmail} */}
                                {/* /> */}
                            {/* </View> */}
                            <View>
                                <Text>新しいパスワード</Text>
                                <Input
                                    onChangeText={val => this.setState({ newPassword: val })}
                                    secureTextEntry={true}
                                />
                            </View>
                            <View>
                                <Button
                                    title='設定'
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

const styles = StyleSheet.create({})