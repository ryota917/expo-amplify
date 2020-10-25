import React from 'react'
import { StyleSheet, Text, View, TextInput, ScrollView } from 'react-native'
import { Auth } from 'aws-amplify';
import { Input, Button, CheckBox } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class Signin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            gender: '',
            address: '',
            phoneNumber: '',
            birthday: '',
            height: '',
            email: '',
            password: '',
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
        this.setState({ gender: gender})
    }

    render() {
        const { gender } = this.state
        if(this.props.authState !== 'signIn') {
            return null;
        } else {
            return(
                <View style={{ flex: 1 }}>
                    <ScrollView style={{ flex: 1, backgroundColor: 'white' }} contentContainerStyle={{ paddingBottom: 40}} >
                        <Icon name='angle-left' size={28} onPress={this.navigateSignin}/>
                        <View>
                            <Text style={styles.signup}>Sign up</Text>
                            <Text>お名前<Text style={styles.must}>必須</Text></Text>
                            <Input />
                            <Text>性別</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Icon.Button
                                    name='check-circle'
                                    onPress={() => this.onGenderCheck('male')}
                                    backgroundColor='white'
                                    iconStyle={{ color: '#7389D9' }}
                                >
                                    <Text style={{ color: 'black' }}>男性</Text>
                                </Icon.Button>
                                <Icon.Button
                                    name='check-circle'
                                    onPress={() => this.onGenderCheck('female')}
                                    backgroundColor='white'
                                    iconStyle={{ color: (gender === 'male') ? '#7389D9' : 'white' }}
                                >
                                    <Text style={{ color: 'black' }}>女性</Text>
                                </Icon.Button>
                                <Icon.Button
                                    name='check-circle'
                                    onPress={() => this.onGenderCheck('other')}
                                    backgroundColor='white'
                                    iconStyle={{ color: '#7389D9'}}
                                >
                                    <Text style={{ color: 'black' }}>その他</Text>
                                </Icon.Button>
                            </View>
                            <Text>お届け先</Text>
                            <Input
                                placeholder='郵便番号'
                            />
                            <Input
                                placeholder='住所'
                            />
                            <Text>生年月日</Text>
                            <Text>電話番号</Text>
                            <Input
                                placeholder='ハイフン不要'
                            />
                            <Text>メールアドレス</Text>
                            <Input />
                            <Text>身長</Text>
                            <Text>パスワード</Text>
                            <Input
                                placeholder='半角英数字'
                            />
                            <Button title='ログイン画面へ' onPress={this.navigateSignin} />
                        </View>
                    </ScrollView>
                    <View style={styles.button}>
                        <Button
                            title='next'
                            buttonStyle={{ borderRadius: 30, width: wp('40%'), height: hp('6%'), backgroundColor: 'white' }}
                            titleStyle={{ color: '#7389D9', fontSize: 16, fontWeight: 'bold' }}
                            //onPress={this.searchWithCondition}
                        />
                    </View>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    checkbox: {
        backgroundColor: 'white',
    },
    signup: {
        width: wp('40%'),
        fontSize: wp('10%'),
        fontWeight: '500'
    },
    button: {
        flex: 1,
        position: 'absolute',
        bottom: hp('4%'),
        right: wp('4%'),
        shadowColor: 'black',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        borderRadius: 30,
    },
    must: {
        backgroundColor: '#7389D9',
        color: 'white',
        marginLeft: wp('5%'),
        textAlign: 'center',
        width: wp('6%'),
        fontSize: wp('3%'),
    }
})
