import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { API, graphqlOperation, Auth } from 'aws-amplify';
import Signup from './Signup'
import { Loading } from 'aws-amplify-react-native'
import { Input, Button } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Modal from 'react-native-modal'
import * as gqlQueries from './src/graphql/queries' // read
import * as gqlMutations from './src/graphql/mutations' // create, update, delete
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
            console.log('error signing in ', error)
            this.setState({ alert: true })
            setTimeout(() => this.setState({ alert: false }), 3000)
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
        if(this.props.authState !== 'signIn' && this.props.authState !== 'confirmSignIn') {
            return null;
        } else {
            return(
                <View style={styles.container}>
                    <Modal isVisible={this.state.isForgotPasswordModalVisible}>
                        <View style={styles.modalContainerView}>
                            <View style={styles.modalInnerView}>
                                <Text style={styles.modalText}>パスワードの再発行を行いますか？</Text>
                                <View style={styles.modalButtonView}>
                                    <Button
                                        title='戻る'
                                        onPress={this.toggleModal}
                                        buttonStyle={{ borderRadius: 25, width: wp('25%'), height: hp('6%'), backgroundColor: '#333333' }}
                                        titleStyle={{ fontSize: 14, color: 'white' }}
                                    />
                                    <Button
                                        title='再発行へ'
                                        onPress={this.navigateForgotPassword}
                                        buttonStyle={{ marginLeft: wp('3%'), borderRadius: 25, width: wp('25%'), height: hp('6%'), backgroundColor: '#7389D9' }}
                                        titleStyle={{ fontSize: 14, color: 'white' }}
                                    />
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.formContainer}>
                            <View>
                                <Text style={styles.loginText}>LOG IN</Text>
                                {/* アラートView */}
                                <View style={{ flexDirection: 'row', display: this.state.alert ? 'block' : 'none' }}>
                                    <Icon name='alert-circle' size={17} style={{ color: '#A60000' }} />
                                    <Text style={{ marginLeft: wp('2%'), color: '#A60000' }}>ログインに失敗しました</Text>
                                </View>
                                <View style={styles.form}>
                                    <Text style={styles.formText}>メールアドレス</Text>
                                    <Input
                                        onChangeText={val => this.setState({ inputedEmail: val })}
                                    />
                                </View>
                                <View style={styles.form}>
                                    <Text style={styles.formText}>パスワード</Text>
                                    <Input
                                        onChangeText={val => this.setState({ inputedPassword: val })}
                                        secureTextEntry={true}
                                    />
                                </View>
                                <View style={styles.toForgotPassworButton}>
                                    <Icon.Button
                                        name='alert-circle'
                                        backgroundColor='white'
                                        iconStyle={{ color: 'silver' }}
                                        onPress={() => this.toggleModal()}
                                    >
                                        <Text style={{ color: 'silver', fontSize: 15, fontWeight: '400' }}>パスワードを忘れた方はこちら</Text>
                                    </Icon.Button>
                                </View>
                                <View style={styles.toSignupButton}>
                                    <Button
                                        title='アカウントをお持ちでない方はこちら'
                                        onPress={this.navigateSignup}
                                        buttonStyle={{ backgroundColor: 'white'}}
                                        titleStyle={{ color: '#7389D9', fontWeight: 'bold', fontSize: 17 }}
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
    scrollView: {
    },
    formContainer: {
        width: wp('80%'),
        left: wp('10%'),
        height: wp('100%'),
        justifyContent: 'center',
        marginTop: hp('3%')
    },
    loginText: {
        width: wp('40%'),
        fontSize: wp('10%'),
        fontWeight: '500',
        marginBottom: hp('3%'),
    },
    form: {
        marginTop: wp('4%')
    },
    formText: {
        fontSize: 16
    },
    toForgotPassworButton: {
        marginTop: -hp('2%')
    },
    toSignupButton: {
        marginTop: wp('8%')
    },
    nextButton: {
        flex: 1,
        position: 'absolute',
        bottom: hp('17%'),
        right: wp('8%'),
        shadowColor: 'black',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        borderRadius: 30,
    }
})