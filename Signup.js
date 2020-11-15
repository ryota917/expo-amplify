import React from 'react'
import { StyleSheet, Text, View, TextInput, ScrollView, Platform, Image, SafeAreaView } from 'react-native'
import { API, graphqlOperation, Auth } from 'aws-amplify';
import * as gqlMutations from './src/graphql/mutations'
import { Button } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

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
            birthday: new Date(2000, 0, 1),
            isBirthdaySelected: false,
            isDatePickerVisible: false,
            height: null,
            isHeightSelected: false,
            nameAlert: false,
            addressAlert: false,
            emailAlert: false,
            passWordAlert: false,
            signUpAlert: false,
            signUpAlertText: '',
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
        const { name, nameKana, email, password, phoneNumber, address, postalCode, height, birthday, isBirthdaySelected, gender } = this.state
        console.log('生年月日です')
        console.log(birthday)
        console.log('身長です')
        console.log(height)
        //空の値に対してバリデーション
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
                        height: isHeightSelected ? height : null,
                        birthday: isBirthdaySelected ? birthday : null,
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
            console.log(error.name)
            switch(error.name) {
                case 'UsernameExistsException':
                    this.setState({ signUpAlertText: 'このメールアドレスは既に使われています'})
                    break;
                case 'InvalidParameterException':
                    if(error.message === 'Username should be an email.') {
                        this.setState({ signUpAlertText: 'メールアドレスが適切に入力されていません'})
                    } else {
                        this.setState({ signUpAlertText: 'メールアドレスまたはパスワードが適切に入力されていません'})
                    }
                    break;
                case 'InvalidPasswordException':
                    this.setState({ signUpAlertText: 'パスワードが適切に入力されていません' })
                default:
                    this.setState({ signUpAlertText: '登録に失敗しました' })
            }
            this.setState({ signUpAlert: true })
            this.refs._scrollView.scrollTo({ x: 5, y: 5, animated: false })
            setTimeout(() => this.setState({ signUpAlert: false }), 3000)
        }
    }

    render() {
        const { gender, birthday, isBirthdaySelected, nameAlert, addressAlert, emailAlert, passwordAlert, signUpAlert, signUpAlertText, isDatePickerVisible } = this.state
        const birthdayText = isBirthdaySelected ? birthday.getFullYear() + '年' + (birthday.getMonth() + 1) + '月' + birthday.getDate() + '日' : '選択してください'
        if(this.props.authState !== 'signUp') {
            return null;
        } else {
            return(
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <View style={styles.headerInner}>
                                <Icon name='chevron-left' size={55} onPress={this.navigateSignin} />
                            </View>
                        </View>
                        <ScrollView ref={'_scrollView'} style={styles.scrollView}>
                            <View style={styles.formContainer}>
                                <View>
                                    <Image source={require('./assets/signup.png')} style={styles.signUpTextImage} />
                                    {/* アラートView */}
                                    <View style={{ flexDirection: 'row', marginBottom: hp('3%'), display: signUpAlert ? 'block' : 'none' }}>
                                        <Icon name='alert-circle' size={17} style={{ color: '#A60000' }} />
                                        <Text style={{ marginLeft: wp('2%'), color: '#A60000' }}>{signUpAlertText}</Text>
                                    </View>
                                    <View style={styles.form}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={styles.title}>お名前</Text>
                                            <Text style={styles.mustText}>必須</Text>
                                        </View>
                                        {/* アラートView */}
                                        <View style={{ flexDirection: 'row', display: nameAlert ? 'block' : 'none' }}>
                                            <Icon name='alert-circle' size={17} style={{ color: '#A60000' }} />
                                            <Text style={styles.alertText}>適切に入力されていません</Text>
                                        </View>
                                        <TextInput
                                            onChangeText={val => this.setState({ name: val })}
                                            placeholder='姓名(漢字)'
                                            style={styles.textInput}
                                        />
                                        <TextInput
                                            onChangeText={val => this.setState({ nameKana: val })}
                                            placeholder='姓名(カナ)'
                                            style={styles.textInput}
                                        />
                                    </View>
                                    <View style={styles.form}>
                                        <Text style={styles.title}>性別</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Icon.Button
                                                name={gender === 'male' ? 'check-circle' : 'checkbox-blank-circle-outline' }
                                                onPress={() => this.onGenderCheck('male')}
                                                backgroundColor='white'
                                                iconStyle={{ color: '#7389D9' }}
                                            >
                                                <Text style={styles.genderText}>男性</Text>
                                            </Icon.Button>
                                            <Icon.Button
                                                name={gender === 'female' ? 'check-circle': 'checkbox-blank-circle-outline' }
                                                onPress={() => this.onGenderCheck('female')}
                                                backgroundColor='white'
                                                iconStyle={{ color: '#7389D9' }}
                                            >
                                                <Text style={styles.genderText}>女性</Text>
                                            </Icon.Button>
                                            <Icon.Button
                                                name={gender === 'other' ? 'check-circle' : 'checkbox-blank-circle-outline' }
                                                onPress={() => this.onGenderCheck('other')}
                                                backgroundColor='white'
                                                iconStyle={{ color: '#7389D9' }}
                                            >
                                                <Text style={styles.genderText}>その他</Text>
                                            </Icon.Button>
                                        </View>
                                    </View>
                                    <View style={styles.form}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={styles.title}>お届け先</Text>
                                            <Text style={styles.mustText}>必須</Text>
                                        </View>
                                        {/* アラートView */}
                                        <View style={{ flexDirection: 'row', display: addressAlert ? 'block' : 'none' }}>
                                            <Icon name='alert-circle' size={17} style={{ color: '#A60000' }} />
                                            <Text style={styles.alertText}>適切に入力されていません</Text>
                                        </View>
                                        <TextInput
                                            placeholder='郵便番号'
                                            onChangeText={val => this.setState({ postalCode: val })}
                                            style={styles.textInput}
                                        />
                                        <TextInput
                                            placeholder='住所'
                                            onChangeText={val => this.setState({ address: val })}
                                            style={styles.textInput}
                                        />
                                    </View>
                                    {Platform.OS === 'android' ? null
                                    :
                                        <View style={styles.form}>
                                            <Text style={styles.title}>生年月日</Text>
                                            <Button
                                                title={birthdayText}
                                                buttonStyle={styles.selectBirthdayButton}
                                                titleStyle={styles.selectBirthdayText}
                                                onPress={() => this.setState({ isDatePickerVisible: true })}
                                            />
                                            <DateTimePickerModal
                                                isVisible={isDatePickerVisible}
                                                date={birthday}
                                                mode="date"
                                                onConfirm={(value) => this.setState({
                                                    birthday: value,
                                                    isDatePickerVisible: false,
                                                    isBirthdaySelected: true
                                                })}
                                                onCancel={() => this.setState({ isDatePickerVisible: false })}
                                                headerTextIOS='生年月日を選択してください'
                                                cancelTextIOS='戻る'
                                                confirmTextIOS='決定'
                                            />
                                        </View>
                                    }
                                    <View style={styles.form}>
                                        <Text style={styles.title}>電話番号</Text>
                                        <TextInput
                                            placeholder='ハイフン不要'
                                            onChangeText={val => this.setState({ phoneNumber: val })}
                                            style={styles.textInput}
                                        />
                                    </View>
                                    <View style={styles.form}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={styles.title}>メールアドレス</Text>
                                            <Text style={styles.mustText}>必須</Text>
                                        </View>
                                        {/* アラートView */}
                                        <View style={{ flexDirection: 'row', display: emailAlert ? 'block' : 'none' }}>
                                            <Icon name='alert-circle' size={17} style={{ color: '#A60000' }} />
                                            <Text style={styles.alertText}>適切に入力されていません</Text>
                                        </View>
                                        <TextInput
                                            onChangeText={val => this.setState({ email: val })}
                                            style={styles.textInput}
                                        />
                                    </View>
                                    <View style={styles.form}>
                                        <Text style={styles.title}>身長</Text>
                                        <TextInput
                                            placeholder='cm'
                                            onChangeText={val => this.setState({ height: Number(val) })}
                                            style={styles.textInput}
                                        />
                                    </View>
                                    <View style={styles.form}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={styles.title}>パスワード</Text>
                                            <Text style={styles.mustText}>必須</Text>
                                        </View>
                                        {/* アラートView */}
                                        <View style={{ flexDirection: 'row', display: passwordAlert ? 'block' : 'none' }}>
                                            <Icon name='alert-circle' size={17} style={{ color: '#A60000' }} />
                                            <Text style={styles.alertText}>適切に入力されていません</Text>
                                        </View>
                                        <TextInput
                                            placeholder='半角英数字8桁以上'
                                            onChangeText={val => this.setState({ password: val })}
                                            style={styles.textInput}
                                            secureTextEntry={true}
                                        />
                                    </View>
                                    <View style={{ height: hp('50%') }}></View>
                                </View>
                            </View>
                        </ScrollView>
                        <View style={styles.nextButtonView}>
                            <Button
                                title='next →'
                                buttonStyle={styles.nextButtonStyle}
                                titleStyle={styles.nextTitleStyle}
                                onPress={this.onPressSignup}
                            />
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
        height: hp('100%'),
    },
    header: {
        alignItems: 'center',
        height: hp('9%'),
    },
    headerInner: {
        flexDirection: 'row',
        marginLeft: -wp('5%'),
        width: wp('86%'),
        height: hp('6%'),
        marginTop: hp('2%')
    },
    scrollView: {
        width: wp('100%'),
        height: hp('92%'),
    },
    formContainer: {
        top: hp('5%'),
        width: wp('80%'),
        left: wp('10%')
    },
    signupText: {
        width: wp('40%'),
        fontSize: wp('10%'),
        fontWeight: '500',
        marginBottom: hp('3%')
    },
    form: {
        marginTop: hp('6%')
    },
    title: {
        fontSize: 14,
        marginBottom: hp('2%'),
    },
    checkbox: {
        backgroundColor: 'white',
    },
    nextButtonView: {
        position: 'absolute',
        bottom: hp('12%'),
        right: wp('10%'),
        shadowColor: 'black',
        shadowOffset: { width: 10, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        borderRadius: 30,
    },
    mustText: {
        backgroundColor: '#7389D9',
        color: 'white',
        fontSize: 13,
        height: 20,
        padding: wp('1%'),
        marginLeft: wp('3%')
    },
    signUpTextImage: {
        width: wp('43%'),
        height: wp('8%'),
        resizeMode: 'contain',
        marginBottom: hp('5%')
    },
    genderText: {
        marginRight: wp('9%')
    },
    textInput: {
        padding: wp('2%'),
        borderBottomColor: 'silver',
        borderBottomWidth: 1.3,
        marginTop: hp('2%'),
        fontSize: 20
    },
    alertText: {
        marginLeft: wp('2%'),
        color: '#A60000',
        fontWeight: '500'
    },
    nextButtonStyle: {
        borderRadius: 50,
        width: wp('42%'),
        height: hp('8%'),
        backgroundColor: 'white'
    },
    nextTitleStyle: {
        color: '#7389D9',
        fontSize: 18,
        fontWeight: 'bold'
    },
    selectBirthdayText: {
        padding: wp('4%'),
        borderBottomColor: 'silver',
        borderBottomWidth: 1.3,
        marginTop: hp('2%'),
        fontSize: 20,
        color: 'silver',
        marginLeft: -wp('40%'),
    },
    selectBirthdayButton: {
        backgroundColor: 'white',
        borderBottomWidth: 1.3,
        borderBottomColor: 'silver'
    }
})
