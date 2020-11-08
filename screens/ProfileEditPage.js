import React from 'react'
import { Picker, Text, View, ScrollView, StyleSheet, Platform } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Input, Button } from 'react-native-elements'
import { Auth, API, graphqlOperation } from 'aws-amplify';
import * as gqlQueries from '../src/graphql/queries' // read
import * as gqlMutations from '../src/graphql/mutations'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import DateTimePicker from '@react-native-community/datetimepicker'

export default class ProfileEditPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: [],
            inputedName: '',
            inputedNameKana: '',
            inputedGender: '',
            inputedAddress: '',
            inputedBirthday: new Date(),
            inputedPostalCode: '',
            inputedPhoneNumber: '',
            inputedHeight: '',
            nameAlert: false,
            addressAlert: false,
        }
    }

    static navigationOptions = ({navigation}) => ({
        title: '登録情報の修正',
        headerLeft: () => <Icon name="chevron-left" size={28} onPress={()=>{navigation.goBack()}} style={{ paddingLeft: wp('4%') }}/>,
    });

    componentDidMount = async () => {
        const currentUser = await Auth.currentAuthenticatedUser()
        const currentUserEmail = currentUser.attributes.email
        const res = await API.graphql(graphqlOperation(gqlQueries.getUser, {id: currentUserEmail}))
        this.setState({
            user: res.data.getUser,
            inputedName: res.data.getUser.name,
            inputedNameKana: res.data.getUser.nameKana,
            inputedGender: res.data.getUser.gender,
            inputedAddress: res.data.getUser.address,
            inputedPostalCode: res.data.getUser.postalCode,
            inputedPhoneNumber: res.data.getUser.phoneNumber,
            inputedHeight: res.data.getUser.height,
            inputedBirthday: new Date(res.data.getUser.birthday)
        })
    }

    onGenderCheck = (gender) => {
        if(this.state.inputedGender === gender) {
            this.setState({ inputedGender: ''})
        } else {
            this.setState({ inputedGender: gender})
        }
    }

    navigateEditPage = () => {
        this.props.navigation.navigate('ProfileEditPage')
    }

    onPressChangeProfile = async () => {
        const nameAlert = !(this.state.inputedName && this.state.inputedNameKana)
        const addressAlert = !(this.state.inputedAddress && this.state.inputedPostalCode)
        this.setState({
            nameAlert: nameAlert,
            addressAlert: addressAlert
        })
        if(nameAlert || addressAlert) this.refs._scrollView.scrollTo({ x: 5, y: 5, animated: false })
        if(this.state.inputedName && this.state.inputedNameKana && this.state.inputedAddress && this.state.inputedPostalCode) {
            await API.graphql(graphqlOperation(gqlMutations.updateUser, {
                input: {
                    id: this.state.user.id,
                    name: this.state.inputedName,
                    nameKana: this.state.inputedNameKana,
                    gender: this.state.inputedGender,
                    address: this.state.inputedAddress,
                    postalCode: this.state.inputedPostalCode,
                    phoneNumber: this.state.inputedPhoneNumber,
                    height: this.state.inputedHeight,
                    birthday: this.state.inputedBirthday
                }
            }))
            await this.props.navigation.navigate('ProfileConfirmPage')
        }
    }

    render() {
        const {
            user,
            inputedGender,
            inputedName,
            inputedNameKana,
            inputedPhoneNumber,
            inputedAddress,
            inputedBirthday,
            inputedPostalCode,
            inputedHeight,
            nameAlert,
            addressAlert
        } = this.state
        return(
            <View style={styles.container}>
                <ScrollView ref={'_scrollView'} style={styles.scrollView}>
                    <View style={styles.innerContainer}>
                        <View style={styles.formView}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.titleText}>名前</Text>
                                <Text style={styles.mustText}>必須</Text>
                            </View>
                            {/* アラートView */}
                            <View style={{ flexDirection: 'row', marginBottom: hp('3%'), display: nameAlert ? 'block' : 'none' }}>
                                <Icon name='alert-circle' size={17} style={{ color: '#A60000' }} />
                                <Text style={{ marginLeft: wp('2%'), color: '#A60000' }}>適切に入力されていません</Text>
                            </View>
                            <Input
                                defaultValue={inputedName}
                                onChangeText={val => this.setState({ inputedName: val })}
                                placeholder='姓名(漢字)'
                            />
                            <Input
                                defaultValue={inputedNameKana}
                                onChangeText={val => this.setState({ inputedNameKana: val })}
                                placeholder='姓名(カナ)'
                            />
                        </View>
                        <View style={styles.formView}>
                            <Text style={styles.titleText}>性別</Text>
                            <View style={{ flexDirection: 'row' }}>
                            <Icon.Button
                                name='check-circle'
                                onPress={() => this.onGenderCheck('male')}
                                backgroundColor='white'
                                iconStyle={{ color: (inputedGender === 'male') ? '#7389D9' : 'white' }}
                            >
                                <Text style={{ color: 'black' }}>男性</Text>
                            </Icon.Button>
                            <Icon.Button
                                name='check-circle'
                                onPress={() => this.onGenderCheck('female')}
                                backgroundColor='white'
                                iconStyle={{ color: (inputedGender === 'female') ? '#7389D9' : 'white' }}
                            >
                                <Text style={{ color: 'black' }}>女性</Text>
                            </Icon.Button>
                            <Icon.Button
                                name='check-circle'
                                onPress={() => this.onGenderCheck('other')}
                                backgroundColor='white'
                                iconStyle={{ color: (inputedGender === 'other') ? '#7389D9' :  'white'}}
                            >
                                <Text style={{ color: 'black' }}>その他</Text>
                            </Icon.Button>
                            </View>
                        </View>
                        <View style={styles.formView}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.titleText}>お届け先</Text>
                                <Text style={styles.mustText}>必須</Text>
                            </View>
                            {/* アラートView */}
                            <View style={{ flexDirection: 'row', marginBottom: hp('3%'), display: addressAlert ? 'block' : 'none' }}>
                                <Icon name='alert-circle' size={17} style={{ color: '#A60000' }} />
                                <Text style={{ marginLeft: wp('2%'), color: '#A60000' }}>適切に入力されていません</Text>
                            </View>
                            <Input
                                placeholder='郵便番号'
                                defaultValue={inputedPostalCode}
                                onChangeText={val => this.setState({ inputedPostalCode: val })}
                            />
                            <Input
                                placeholder='住所'
                                defaultValue={inputedAddress}
                                onChangeText={val => this.setState({ inputedAddress: val })}
                            />
                        </View>
                        {Platform.OS === 'android' ? null
                        :
                            <View style={styles.formView}>
                                <Text style={styles.titleText}>生年月日</Text>
                                <DateTimePicker
                                    style={{ width: wp('70%')}}
                                    value={inputedBirthday}
                                    mode={'date'}
                                    onChange={(event, date) => this.setState({ inputedBirthday: date })}
                                />
                            </View>
                        }
                        <View style={styles.formView}>
                            <Text style={styles.titleText}>電話番号</Text>
                            <Input
                                placeholder='電話番号'
                                defaultValue={inputedPhoneNumber}
                                onChangeText={val => this.setState({ inputedPhoneNumber: val })}
                            />
                        </View>
                        <View style={styles.formView}>
                            <Text style={styles.titleText}>身長</Text>
                            <Picker
                                selectedValue={inputedHeight}
                                onValueChange={value => this.setState({ inputedHeight: value })}
                                style={{ marginTop: -hp('12%') }}
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
                        <View style={{ flexDirection: 'row', marginTop: hp('3%') }}>
                            <View style={styles.changeButton}>
                                <Button
                                    title='戻る'
                                    buttonStyle={{
                                        borderRadius: 30,
                                        width: wp('30%'),
                                        height: hp('7%'),
                                        backgroundColor: 'white',
                                    }}
                                    titleStyle={{
                                        color: '#7389D9',
                                        fontSize: 16,
                                        fontWeight: 'bold'
                                    }}
                                    onPress={() => this.props.navigation.goBack()}
                                />
                            </View>
                            <View style={styles.changeButton}>
                                <Button
                                    title='変更確定 →'
                                    buttonStyle={{
                                        borderRadius: 30,
                                        width: wp('40%'),
                                        height: hp('7%'),
                                        backgroundColor: '#7389D9',
                                        marginLeft: wp('10%')
                                    }}
                                    titleStyle={{
                                        color: 'white',
                                        fontSize: 16,
                                        fontWeight: 'bold'
                                    }}
                                    onPress={() => this.onPressChangeProfile()}
                                />
                            </View>
                        </View>
                        <View style={{ height: hp('20%') }}></View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: hp('100%'),
        width: wp('100%'),
        backgroundColor: 'white'
    },
    scrollView: {},
    innerContainer: {
        width: wp('80%'),
        left: wp('10%')
    },
    formView: {
        marginTop: hp('5%')
    },
    titleText: {
        marginBottom: hp('3%'),
        fontSize: 15
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
    changeButton: {
        shadowColor: 'black',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        borderRadius: 30,
        marginTop: hp('2%'),
    },
})

