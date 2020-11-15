import React from 'react'
import { StyleSheet, Text, View, TextInput, SafeAreaView } from 'react-native'
import { Auth } from 'aws-amplify';
import { Button } from 'react-native-elements'
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
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <View style={styles.headerInner}>
                                <Icon name='angle-left' size={45} onPress={this.navigateSignin}/>
                                <Text style={styles.headerText}>パスワードの再設定</Text>
                            </View>
                        </View>
                        <View style={styles.innerContainer}>
                            <View>
                                <View>
                                    <Text style={styles.alertText}>メールアドレスを入力して{"\n"}確認コードを発行してください。</Text>
                                </View>
                                <View style={styles.formView}>
                                    <Text style={styles.formText}>メールアドレス</Text>
                                    <TextInput
                                        onChangeText={val => this.setState({ email: val })}
                                        style={styles.textInput}
                                    />
                                </View>
                                <View style={styles.sendButtonView}>
                                    <Button
                                        title='送信'
                                        buttonStyle={styles.sendButtonStyle}
                                        onPress={this.onPressForgotPasswordButton}
                                    />
                                </View>
                            </View>
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
        height: hp('100%')
    },
    header: {
        alignItems: 'center',
        height: hp('9%')
    },
    headerInner: {
        flexDirection: 'row',
        width: wp('86%'),
        height: hp('6%'),
        marginTop: hp('2%')
    },
    headerText: {
        fontSize: 18,
        marginLeft: wp('17%'),
        marginTop: hp('2%'),
        fontSize: 18,
    },
    innerContainer: {
        width: wp('70%'),
        height: hp('100%'),
        left: wp('15%'),
        top: hp('4%')
    },
    alertText: {
        lineHeight: 22,
        marginTop: hp('2%'),
        marginBottom: hp('10%'),
        fontSize: 16,
    },
    formText: {
        color: 'silver'
    },
    textInput: {
        borderBottomColor: 'silver',
        borderBottomWidth: 1.3,
        marginTop: hp('3%'),
        fontSize: 20
    },
    sendButtonView: {
        marginTop: hp('10%'),
    },
    sendButtonStyle: {
        backgroundColor: '#7389D9',
        borderRadius: 50,
        height: hp('8%'),
    }
})