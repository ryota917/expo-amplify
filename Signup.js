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
        let pickers = [];
        for(let i = 130; i < 230; i++) {
            pickers.push(<Picker.Item lable={i} value={i} key={i} />)
        }
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
                                        <Picker.Item label='130' value='130' />
                                        <Picker.Item label='131' value='131' />
                                        <Picker.Item label='132' value='132' />
                                        <Picker.Item label='133' value='133' />
                                        <Picker.Item label='134' value='134' />
                                        <Picker.Item label='135' value='135' />
                                        <Picker.Item label='136' value='136' />
                                        <Picker.Item label='137' value='137' />
                                        <Picker.Item label='138' value='138' />
                                        <Picker.Item label='139' value='139' />
                                        <Picker.Item label='140' value='140' />
                                        <Picker.Item label='141' value='141' />
                                        <Picker.Item label='142' value='142' />
                                        <Picker.Item label='143' value='143' />
                                        <Picker.Item label='144' value='144' />
                                        <Picker.Item label='145' value='145' />
                                        <Picker.Item label='146' value='146' />
                                        <Picker.Item label='147' value='147' />
                                        <Picker.Item label='148' value='148' />
                                        <Picker.Item label='149' value='149' />
                                        <Picker.Item label='150' value='150' />
                                        <Picker.Item label='151' value='151' />
                                        <Picker.Item label='152' value='152' />
                                        <Picker.Item label='153' value='153' />
                                        <Picker.Item label='154' value='154' />
                                        <Picker.Item label='155' value='155' />
                                        <Picker.Item label='156' value='156' />
                                        <Picker.Item label='157' value='157' />
                                        <Picker.Item label='158' value='158' />
                                        <Picker.Item label='159' value='159' />
                                        <Picker.Item label='160' value='160' />
                                        <Picker.Item label='161' value='161' />
                                        <Picker.Item label='162' value='162' />
                                        <Picker.Item label='163' value='163' />
                                        <Picker.Item label='164' value='164' />
                                        <Picker.Item label='165' value='165' />
                                        <Picker.Item label='166' value='166' />
                                        <Picker.Item label='167' value='167' />
                                        <Picker.Item label='168' value='168' />
                                        <Picker.Item label='169' value='169' />
                                        <Picker.Item label='170' value='170' />
                                        <Picker.Item label='171' value='171' />
                                        <Picker.Item label='172' value='172' />
                                        <Picker.Item label='173' value='173' />
                                        <Picker.Item label='174' value='174' />
                                        <Picker.Item label='175' value='175' />
                                        <Picker.Item label='176' value='176' />
                                        <Picker.Item label='177' value='177' />
                                        <Picker.Item label='178' value='178' />
                                        <Picker.Item label='179' value='179' />
                                        <Picker.Item label='180' value='180' />
                                        <Picker.Item label='181' value='181' />
                                        <Picker.Item label='182' value='182' />
                                        <Picker.Item label='183' value='183' />
                                        <Picker.Item label='184' value='184' />
                                        <Picker.Item label='185' value='185' />
                                        <Picker.Item label='186' value='186' />
                                        <Picker.Item label='187' value='187' />
                                        <Picker.Item label='188' value='188' />
                                        <Picker.Item label='189' value='189' />
                                        <Picker.Item label='190' value='190' />
                                        <Picker.Item label='191' value='191' />
                                        <Picker.Item label='192' value='192' />
                                        <Picker.Item label='193' value='193' />
                                        <Picker.Item label='194' value='194' />
                                        <Picker.Item label='195' value='195' />
                                        <Picker.Item label='196' value='196' />
                                        <Picker.Item label='197' value='197' />
                                        <Picker.Item label='198' value='198' />
                                        <Picker.Item label='199' value='199' />
                                        <Picker.Item label='200' value='200' />
                                        <Picker.Item label='201' value='201' />
                                        <Picker.Item label='202' value='202' />
                                        <Picker.Item label='203' value='203' />
                                        <Picker.Item label='204' value='204' />
                                        <Picker.Item label='205' value='205' />
                                        <Picker.Item label='206' value='206' />
                                        <Picker.Item label='207' value='207' />
                                        <Picker.Item label='208' value='208' />
                                        <Picker.Item label='209' value='209' />
                                        <Picker.Item label='210' value='210' />
                                        <Picker.Item label='211' value='211' />
                                        <Picker.Item label='212' value='212' />
                                        <Picker.Item label='213' value='213' />
                                        <Picker.Item label='214' value='214' />
                                        <Picker.Item label='215' value='215' />
                                        <Picker.Item label='216' value='216' />
                                        <Picker.Item label='217' value='217' />
                                        <Picker.Item label='218' value='218' />
                                        <Picker.Item label='219' value='219' />
                                        <Picker.Item label='220' value='220' />
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
                                <View style={{ height: hp('50%') }}></View>
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
