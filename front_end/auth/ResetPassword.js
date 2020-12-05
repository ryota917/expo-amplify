import React from 'react'
import { StyleSheet, Text, TextInput, View, SafeAreaView } from 'react-native'
import { Auth } from 'aws-amplify';
import { Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'


export class ResetPassword extends React.Component {
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
            this.props.onStateChange('signIn')
        } catch(err) {
            console.error(err)
        }
    }

    render() {
        if(this.props.authState !== 'requireNewPassword') {
            return null;
        } else {
            return(
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <View style={styles.headerInner}>
                                <Icon name='chevron-left' size={55} onPress={this.navigateSignin} />
                                <Text style={styles.headerText}>新しいパスワードの設定</Text>
                            </View>
                        </View>
                        <View style={styles.innerContainer}>
                            <View>
                                <View style={styles.formView}>
                                    <Text style={styles.formText}>確認コード</Text>
                                    <TextInput
                                        onChangeText={val => this.setState({ verificationCode: val })}
                                        style={styles.textInput}
                                    />
                                </View>
                                <View style={styles.formView}>
                                    <Text style={styles.formText}>新しいパスワード</Text>
                                    <TextInput
                                        placeholder='半角英数字8桁以上'
                                        onChangeText={val => this.setState({ newPassword: val })}
                                        secureTextEntry={true}
                                        style={styles.textInput}
                                    />
                                </View>
                                <View style={styles.confirmButtonView}>
                                    <Button
                                        title='設定'
                                        buttonStyle={styles.confirmButtonStyle}
                                        onPress={this.onPressResetPassword}
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
        marginLeft: -wp('5%'),
        width: wp('86%'),
        height: hp('6%'),
        marginTop: hp('2%')
    },
    headerText: {
        fontSize: 18,
        marginLeft: wp('10%'),
        marginTop: hp('2.5%'),
    },
    innerContainer: {
        width: wp('70%'),
        height: hp('100%'),
        left: wp('15%'),
        top: hp('4%')
    },
    formView: {
        marginTop: hp('7%')
    },
    formText: {
    },
    textInput: {
        padding: wp('2%'),
        borderBottomColor: 'silver',
        borderBottomWidth: 1.3,
        marginTop: hp('2%'),
        fontSize: 20
    },
    confirmButtonView: {
        marginTop: hp('10%')
    },
    confirmButtonStyle: {
        backgroundColor: '#7389D9',
        borderRadius: 50,
        height: hp('8%')
    }
})