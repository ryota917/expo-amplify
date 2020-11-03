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
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Icon name='angle-left' size={30} onPress={this.navigateSignin}/>
                        <Text style={styles.headerText}>パスワードの再設定</Text>
                    </View>
                    <View style={styles.innerContainer}>
                        <View>
                            <View>
                                <Text style={styles.alertText}>メールアドレスを入力して{"\n"}確認コードを発行してください。</Text>
                            </View>
                            <View style={styles.formView}>
                                <Text style={styles.formText}>メールアドレス</Text>
                                <Input
                                    onChangeText={val => this.setState({ email: val })}
                                    placeholder='半角英数字8文字以上'
                                />
                            </View>
                            <View>
                                <Button
                                    title='送信'
                                    titleStyle={{}}
                                    buttonStyle={{ backgroundColor: '#7389D9', borderRadius: 30, height: hp('7%') }}
                                    onPress={this.onPressForgotPasswordButton}
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
    alertText: {
        marginBottom: hp('8%')
    },
    formView: {
    },
    formText: {
    }
})