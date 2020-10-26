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
            email: ''
        }
    }

    navigateSignin = () => {
        this.props.onStateChange('signIn')
    }

    onPressForgotPasswordButton = async () => {
        try {
            const { email } = this.state
            const ForgotPassword = await Auth.forgotPassword(email)
            //認証されていないユーザーはinvalidparameterexception
            console.log(ForgotPassword)
            this.props.onStateChange('requireNewPassword', email)
        } catch(err) {
            console.error(err)
        }
    }

    render() {
        if(this.props.authState !== 'forgotPassword') {
            return null;
        } else {
            return(
                <View>
                    <View>
                        <View style={styles.header}>
                            <Icon name='angle-left' size={50} onPress={this.navigateSignin}/>
                            <Text>パスワードの再設定</Text>
                        </View>
                        <View>
                            <Text>メールアドレスを入力して確認コードを発行してください。</Text>
                            <View>
                                <Text>メールアドレス</Text>
                                <Input
                                    onChangeText={val => this.setState({ email: val })}
                                />
                            </View>
                            <Button
                                title='送信'
                                onPress={this.onPressForgotPasswordButton}
                            />
                        </View>
                    </View>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({})