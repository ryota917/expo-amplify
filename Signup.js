import React from 'react'
import { StyleSheet, Text, View, TextInput, ScrollView, Picker } from 'react-native'
import { API, graphqlOperation, Auth } from 'aws-amplify';
import * as gqlMutations from './src/graphql/mutations'
import { Input, Button, CheckBox } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import DateTimePicker from '@react-native-community/datetimepicker'

export default class Signin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            nameKana: '',
            email: '',
            password: '',
            postalCode: '',
            address: '',
            phoneNumber: '',
            gender: '',
            birthday: new Date(),
            height: '160',
            nameAlert: false,
            addressAlert: false,
            emailAlert: false,
            passWordAlert: false,
            signUpAlert: false
        }
    }

    login = async () => {
        const { email, password } = this.state
        try {
            const user = await Auth.signIn(email, password)
            console.log('successfully signuped!')
            console.log(user)
        } catch(error) {
            console.log('error signing up ', error)
        }
    }

    navigateSignin = () => {
        this.props.onStateChange('signIn')
    }

    onGenderCheck = (gender) => {
        if(this.state.gender === gender) {
            this.setState({ gender: ''})
        } else {
            this.setState({ gender: gender})
        }
    }

    onPressSignup = async () => {
        const { name, nameKana, email, password, phoneNumber, address, postalCode, height, birthday, gender } = this.state
        const nameAlert = !(name && nameKana)
        const addressAlert = !(address && postalCode)
        const emailAlert = !email
        const passwordAlert = !password
        this.setState({
            nameAlert: nameAlert,
            addressAlert: addressAlert,
            emailAlert: emailAlert,
            passwordAlert: passwordAlert
        })
        if(nameAlert || addressAlert || emailAlert || passwordAlert ) this.refs._scrollView.scrollTo({ x: 5, y: 5, animated: false })
        try {
            if(name && nameKana && email && password && postalCode && address) {
                console.log('Cognitoにサインアップします')
                await Auth.signUp(email, password)
                await API.graphql(graphqlOperation(gqlMutations.createUser, {
                    input: {
                        id: email,
                        cartId: email,
                        name: name,
                        nameKana: nameKana,
                        phoneNumber: phoneNumber,
                        address: address,
                        postalCode: postalCode,
                        height: height,
                        birthday: birthday,
                        gender: gender,
                        rental: false
                    }
                }))
                await API.graphql(graphqlOperation(gqlMutations.createCart, {
                    input: {
                        id: email,
                        userId: email
                    }
                }))
                this.props.onStateChange('confirmSignUp', { email: email })
            }
        } catch(error) {
            console.error(error)
            this.setState({ signUpAlert: true })
            this.refs._scrollView.scrollTo({ x: 5, y: 5, animated: false })
        }
    }

    render() {
        const { gender, nameAlert, addressAlert, emailAlert, passwordAlert, signUpAlert } = this.state
        if(this.props.authState !== 'signUp') {
            return null;
        } else {
            return(
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Icon name='chevron-left' size={30} onPress={this.navigateSignin} style={styles.backIcon}/>
                    </View>
                    <ScrollView ref={'_scrollView'} style={styles.scrollView}>
                        <View style={styles.formContainer}>
                            <View>
                                <Text style={styles.signupText}>SIGN UP</Text>
                                {/* アラートView */}
                                <View style={{ flexDirection: 'row', marginBottom: hp('3%'), display: signUpAlert ? 'block' : 'none' }}>
                                    <Icon name='alert-circle' size={17} style={{ color: '#A60000' }} />
                                    <Text style={{ marginLeft: wp('2%'), color: '#A60000' }}>登録に失敗しました</Text>
                                </View>
                                <View style={styles.form}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.title}>お名前</Text>
                                        <Text style={styles.mustText}>必須</Text>
                                    </View>
                                    {/* アラートView */}
                                    <View style={{ flexDirection: 'row', marginBottom: hp('3%'), display: nameAlert ? 'block' : 'none' }}>
                                        <Icon name='alert-circle' size={17} style={{ color: '#A60000' }} />
                                        <Text style={{ marginLeft: wp('2%'), color: '#A60000' }}>適切に入力されていません</Text>
                                    </View>
                                    <Input
                                        onChangeText={val => this.setState({ name: val })}
                                        placeholder='姓名(漢字)'
                                    />
                                    <Input
                                        onChangeText={val => this.setState({ nameKana: val })}
                                        placeholder='姓名(カナ)'
                                    />
                                </View>
                                <View style={styles.form}>
                                    <Text style={styles.title}>性別</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon.Button
                                            name='check-circle'
                                            onPress={() => this.onGenderCheck('male')}
                                            backgroundColor='white'
                                            iconStyle={{ color: (gender === 'male') ? '#7389D9' : 'white' }}
                                        >
                                            <Text style={{ color: 'black' }}>男性</Text>
                                        </Icon.Button>
                                        <Icon.Button
                                            name='check-circle'
                                            onPress={() => this.onGenderCheck('female')}
                                            backgroundColor='white'
                                            iconStyle={{ color: (gender === 'female') ? '#7389D9' : 'white' }}
                                        >
                                            <Text style={{ color: 'black' }}>女性</Text>
                                        </Icon.Button>
                                        <Icon.Button
                                            name='check-circle'
                                            onPress={() => this.onGenderCheck('other')}
                                            backgroundColor='white'
                                            iconStyle={{ color: (gender === 'other') ? '#7389D9' :  'white'}}
                                        >
                                            <Text style={{ color: 'black' }}>その他</Text>
                                        </Icon.Button>
                                    </View>
                                </View>
                                <View style={styles.form}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.title}>お届け先</Text>
                                        <Text style={styles.mustText}>必須</Text>
                                    </View>
                                    {/* アラートView */}
                                    <View style={{ flexDirection: 'row', marginBottom: hp('3%'), display: addressAlert ? 'block' : 'none' }}>
                                        <Icon name='alert-circle' size={17} style={{ color: '#A60000' }} />
                                        <Text style={{ marginLeft: wp('2%'), color: '#A60000' }}>適切に入力されていません</Text>
                                    </View>
                                    <Input
                                        placeholder='郵便番号'
                                        onChangeText={val => this.setState({ postalCode: val })}
                                    />
                                    <Input
                                        placeholder='住所'
                                        onChangeText={val => this.setState({ address: val })}
                                    />
                                </View>
                                <View style={styles.form}>
                                    <Text style={styles.title}>生年月日</Text>
                                    <DateTimePicker
                                        style={{ width: wp('70%')}}
                                        value={this.state.birthday}
                                        mode={'date'}
                                        onChange={(event, date) => this.setState({ birthday: date })}
                                    />
                                </View>
                                <View style={styles.form}>
                                    <Text style={styles.title}>電話番号</Text>
                                    <Input
                                        placeholder='ハイフン不要'
                                        onChangeText={val => this.setState({ phoneNumber: val })}
                                    />
                                </View>
                                <View style={styles.form}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.title}>メールアドレス</Text>
                                        <Text style={styles.mustText}>必須</Text>
                                    </View>
                                    {/* アラートView */}
                                    <View style={{ flexDirection: 'row', marginBottom: hp('3%'), display: emailAlert ? 'block' : 'none' }}>
                                        <Icon name='alert-circle' size={17} style={{ color: '#A60000' }} />
                                        <Text style={{ marginLeft: wp('2%'), color: '#A60000' }}>適切に入力されていません</Text>
                                    </View>
                                    <Input
                                        onChangeText={val => this.setState({ email: val })}
                                    />
                                </View>
                                <View style={styles.form}>
                                    <Text style={styles.title}>身長</Text>
                                    <Picker
                                        selectedValue={this.state.height}
                                        onValueChange={value => this.setState({ height: value })}
                                    >
                                        <Picker.Item label='120' value='120' />
                                        <Picker.Item label='130' value='130' />
                                        <Picker.Item label='140' value='140' />
                                        <Picker.Item label='150' value='150' />
                                        <Picker.Item label='160' value='160' />
                                        <Picker.Item label='170' value='170' />
                                        <Picker.Item label='180' value='180' />
                                        <Picker.Item label='190' value='190' />
                                        <Picker.Item label='200' value='200' />
                                        <Picker.Item label='210' value='210' />
                                        <Picker.Item label='220' value='220' />
                                        <Picker.Item label='230' value='230' />
                                    </Picker>
                                </View>
                                <View style={styles.form}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.title}>パスワード</Text>
                                        <Text style={styles.mustText}>必須</Text>
                                    </View>
                                    {/* アラートView */}
                                    <View style={{ flexDirection: 'row', marginBottom: hp('3%'), display: passwordAlert ? 'block' : 'none' }}>
                                        <Icon name='alert-circle' size={17} style={{ color: '#A60000' }} />
                                        <Text style={{ marginLeft: wp('2%'), color: '#A60000' }}>適切に入力されていません</Text>
                                    </View>
                                    <Input
                                        placeholder='半角英数字8文字以上'
                                        onChangeText={val => this.setState({ password: val })}
                                        secureTextEntry={true}
                                    />
                                </View>
                                <View style={{ height: hp('25%') }}></View>
                            </View>
                        </View>
                    </ScrollView>
                    <View style={styles.button}>
                        <Button
                            title='next →'
                            buttonStyle={{ borderRadius: 30, width: wp('30%'), height: hp('6%'), backgroundColor: 'white' }}
                            titleStyle={{ color: '#7389D9', fontSize: 16, fontWeight: 'bold' }}
                            onPress={this.onPressSignup}
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
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        left: wp('7%'),
        top: wp('3%'),
        height: hp('8%')
    },
    backIcon: {
        left: -wp('4%'),
    },
    scrollView: {
        flex: 1,
        width: wp('100%')
    },
    formContainer: {
        width: wp('80%'),
        top: hp('3%'),
        left: wp('10%')
    },
    signupText: {
        width: wp('40%'),
        fontSize: wp('10%'),
        fontWeight: '500',
        marginBottom: hp('3%')
    },
    form: {
        marginTop: hp('4%')
    },
    title: {
        marginBottom: hp('2%'),
        fontSize: 16
    },
    checkbox: {
        backgroundColor: 'white',
    },
    button: {
        flex: 1,
        position: 'absolute',
        bottom: hp('10%'),
        right: wp('8%'),
        shadowColor: 'black',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        borderRadius: 30,
    },
    mustText: {
        backgroundColor: '#7389D9',
        textAlign: 'center',
        color: 'white',
        fontSize: 13,
        height: hp('2.5%'),
        paddingTop: wp('0.5%'),
        width: wp('9%'),
        marginLeft: wp('3%')
    },
})
