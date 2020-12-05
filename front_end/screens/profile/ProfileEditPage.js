import React from 'react'
import { Text, View, StyleSheet, Platform, SafeAreaView, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-elements'
import { Auth, API, graphqlOperation } from 'aws-amplify';
import * as gqlQueries from '../../../src/graphql/queries' // read
import * as gqlMutations from '../../../src/graphql/mutations'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import{ KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import SingleButtonModal from '../common/SingleButtonModal'

export class ProfileEditPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: [],
            inputedName: '',
            inputedNameKana: '',
            inputedGender: '',
            inputedAddress: '',
            inputedBirthday: new Date(2000, 0, 1),
            isDatePickerVisible: false,
            isBirthdaySelected: false,
            inputedPostalCode: '',
            inputedPhoneNumber: '',
            inputedHeight: '',
            nameAlert: false,
            addressAlert: false,
            isUpdatedModal: false
        }
    }

    static navigationOptions = ({navigation}) => ({
        title: '登録情報の修正',
        headerLeft: () => <Icon name="chevron-left" size={42} onPress={()=>{navigation.goBack()}} style={{ paddingLeft: wp('4%') }}/>,
        headerStyle: {
            height: hp('7%')
        }
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
        if(nameAlert || addressAlert) this.refs._scrollView.scrollToPosition(5, 5, false)
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
            this.setState({ isUpdatedModal: true })
        }
    }

    onPressSingleButton = () => {
        this.setState({ isUpdatedModal: false })
        this.props.navigation.navigate('ProfileConfirmPage')
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
            addressAlert,
            isBirthdaySelected,
            isDatePickerVisible,
            isUpdatedModal
        } = this.state

        const birthday = new Date(user.birthday)
        const birthdayText = user.birthday ? birthday.getFullYear() + '年' + (birthday.getMonth() + 1) + '月' + birthday.getDate() + '日' : '選択してください'
        // if(isBirthdaySelected) {
        //     birthdayText = birthday.getFullYear() + '年' + (birthday.getMonth() + 1) + '月' + birthday.getDate() + '日'
        // }

        return(
            <SafeAreaView style={{ flex: 1 }}>
                <SingleButtonModal
                    isModalVisible={isUpdatedModal}
                    onPressButton={() => this.onPressSingleButton()}
                    text='登録情報が更新されました'
                    buttonText='完了'
                />
                <KeyboardAwareScrollView style={styles.scrollView} ref="_scrollView">
                    <View style={styles.innerContainer}>
                        <View style={styles.formView}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.titleText}>名前</Text>
                                <Text style={styles.mustText}>必須</Text>
                            </View>
                            {/* アラートView */}
                            <View style={styles.alertView}>
                                <Icon name='alert-circle' size={17} style={{ color: '#A60000', display: nameAlert ? 'flex' : 'none' }} />
                                <Text style={[styles.alertText, { display: nameAlert ? 'flex' : 'none' }]}>適切に入力されていません</Text>
                            </View>
                            <TextInput
                                defaultValue={inputedName}
                                style={styles.textInput}
                                onChangeText={val => this.setState({ inputedName: val })}
                                placeholder='姓名(漢字)'
                            />
                            <TextInput
                                defaultValue={inputedNameKana}
                                style={styles.textInput}
                                onChangeText={val => this.setState({ inputedNameKana: val })}
                                placeholder='姓名(カナ)'
                            />
                        </View>
                        <View style={styles.formView}>
                            <Text style={styles.titleText}>性別</Text>
                            <View style={styles.alertView}></View>
                            <View style={{ flexDirection: 'row' }}>
                            <Icon.Button
                                name={inputedGender === 'male' ? 'check-circle' : 'checkbox-blank-circle-outline' }
                                onPress={() => this.onGenderCheck('male')}
                                backgroundColor='white'
                                iconStyle={{ color: '#7389D9' }}
                            >
                                <Text style={styles.genderText}>男性</Text>
                            </Icon.Button>
                            <Icon.Button
                                name={inputedGender === 'female' ? 'check-circle' : 'checkbox-blank-circle-outline' }
                                onPress={() => this.onGenderCheck('female')}
                                backgroundColor='white'
                                iconStyle={{ color: '#7389D9' }}
                            >
                                <Text style={styles.genderText}>女性</Text>
                            </Icon.Button>
                            <Icon.Button
                                name={inputedGender === 'other' ? 'check-circle' : 'checkbox-blank-circle-outline' }
                                onPress={() => this.onGenderCheck('other')}
                                backgroundColor='white'
                                iconStyle={{ color: '#7389D9' }}
                            >
                                <Text style={styles.genderText}>その他</Text>
                            </Icon.Button>
                            </View>
                        </View>
                        <View style={styles.formView}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.titleText}>お届け先</Text>
                                <Text style={styles.mustText}>必須</Text>
                            </View>
                            {/* アラートView */}
                            <View style={styles.alertView}>
                                <Icon name='alert-circle' size={17} style={{ color: '#A60000', display: addressAlert ? 'flex' : 'none' }} />
                                <Text style={[styles.alertText, { display: addressAlert ? 'flex' : 'none' }]}>適切に入力されていません</Text>
                            </View>
                            <TextInput
                                style={styles.textInput}
                                defaultValue={inputedPostalCode}
                                onChangeText={val => this.setState({ inputedPostalCode: val })}
                            />
                            <TextInput
                                style={styles.textInput}
                                defaultValue={inputedAddress}
                                onChangeText={val => this.setState({ inputedAddress: val })}
                            />
                        </View>
                        {Platform.OS === 'android' ? null
                                :
                                    <View style={styles.formView}>
                                        <Text style={styles.titleText}>生年月日</Text>
                                        <View style={styles.alertView}></View>
                                        <Button
                                            title={birthdayText}
                                            buttonStyle={styles.selectBirthdayButton}
                                            titleStyle={styles.selecdtBirthdayText}
                                            onPress={() => this.setState({ isDatePickerVisible: true })}
                                        />
                                        <DateTimePickerModal
                                            isVisible={isDatePickerVisible}
                                            mode="date"
                                            isDardModeEnabled={false}
                                            onConfirm={(value) => this.setState({
                                                inputedBirthday: value,
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
                        <View style={styles.formView}>
                            <Text style={styles.titleText}>電話番号</Text>
                            <View style={styles.alertView}></View>
                            <TextInput
                                placeholder='電話番号'
                                style={styles.textInput}
                                defaultValue={inputedPhoneNumber}
                                onChangeText={val => this.setState({ inputedPhoneNumber: val })}
                            />
                        </View>
                        <View style={styles.formView}>
                            <Text style={styles.titleText}>身長</Text>
                            <View style={styles.alertView}></View>
                            <TextInput
                                placeholder='cm'
                                defaultValue={String(inputedHeight)}
                                onChangeText={val => this.setState({ inputedHeight: val })}
                                style={styles.textInput}
                            />
                        </View>
                        <View style={styles.footerButtonView}>
                            <View style={styles.changeButtonView}>
                                <Button
                                    title='戻る'
                                    buttonStyle={styles.backButtonStyle}
                                    titleStyle={styles.backButtonTitleStyle}
                                    onPress={() => this.props.navigation.goBack()}
                                />
                            </View>
                            <View style={styles.changeButtonView}>
                                <Button
                                    title='変更確定 →'
                                    buttonStyle={styles.changeButtonStyle}
                                    titleStyle={styles.changeButtonTitle}
                                    onPress={() => this.onPressChangeProfile()}
                                />
                            </View>
                        </View>
                        <View style={{ height: hp('20%') }}></View>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: 'white'
    },
    innerContainer: {
        width: wp('80%'),
        left: wp('10%')
    },
    formView: {
        marginTop: hp('5%')
    },
    titleText: {
        fontSize: 14,
    },
    mustText: {
        backgroundColor: '#7389D9',
        color: 'white',
        fontSize: 13,
        height: 20,
        padding: wp('1%'),
        marginLeft: wp('3%'),
        bottom: hp('0.4%')
    },
    changeButtonView: {
        shadowColor: 'black',
        shadowOffset: { width: 10, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        borderRadius: 30,
        marginTop: hp('2%'),
    },
    backButtonStyle: {
        borderRadius: 50,
        width: wp('30%'),
        height: hp('8%'),
        backgroundColor: 'white',
    },
    backButtonTitleStyle: {
        color: '#7389D9',
        fontSize: 16,
        fontWeight: 'bold'
    },
    changeButtonStyle: {
        borderRadius: 50,
        width: wp('40%'),
        height: hp('8%'),
        backgroundColor: '#7389D9',
        marginLeft: wp('10%')
    },
    changeButtonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },
    textInput: {
        padding: wp('2%'),
        borderBottomColor: 'silver',
        borderBottomWidth: 1.3,
        marginTop: hp('2%'),
        fontSize: 20
    },
    selectBirthdayText: {
        padding: wp('4%'),
        borderBottomColor: 'silver',
        borderBottomWidth: 1.3,
        marginTop: hp('2%'),
        fontSize: 20,
        color: 'black',
        marginLeft: -wp('40%'),
    },
    selectBirthdayButton: {
        backgroundColor: 'white',
        borderBottomWidth: 1.3,
        borderBottomColor: 'silver'
    },
    genderText: {
        marginRight: wp('9%')
    },
    alertView: {
        paddingTop: hp('1%'),
        flexDirection: 'row',
        marginTop: hp('1%'),
        height: hp('4%')
    },
    alertText: {
        marginLeft: wp('2%'),
        color: '#A60000',
        fontWeight: '500'
    },
    footerButtonView: {
        flexDirection: 'row',
        marginTop: hp('7%')
    }
})

