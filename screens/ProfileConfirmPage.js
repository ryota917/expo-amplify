import React from 'react'
import { Text, View ,ScrollView, StyleSheet, Platform, SafeAreaView, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import { Button } from 'react-native-elements'
import { Auth, API, graphqlOperation } from 'aws-amplify';
import * as gqlQueries from '../src/graphql/queries' // read
import Modal from 'react-native-modal'
import{ KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class ProfileConfirmPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: [],
            nowPassword: '',
            newPassword: '',
            isPasswordModalVisible: false,
            passwordAlert: false
        }
    }

    static navigationOptions = ({navigation}) => ({
        title: '登録情報の確認',
        headerLeft: () => <Icon name="bars" size={28} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft:20}}/>,
    });

    componentDidMount = async () => {
        const currentUser = await Auth.currentAuthenticatedUser()
        const currentUserEmail = currentUser.attributes.email
        const user = await API.graphql(graphqlOperation(gqlQueries.getUser, {id: currentUserEmail}))
        this.setState({ user: user.data.getUser })
        this.props.navigation.addListener('didFocus', async () => {
            const user = await API.graphql(graphqlOperation(gqlQueries.getUser, {id: currentUserEmail}))
            this.setState({
                user: user.data.getUser
            })
        })
    }
    navigateEditPage = () => {
        this.props.navigation.navigate('ProfileEditPage')
    }

    onPressResetPassword = async () => {
        try{
            const user = await Auth.currentAuthenticatedUser()
            const changePassword = await Auth.changePassword(
                user,
                this.state.nowPassword,
                this.state.newPassword
            )
            console.log(changePassword)
            this.setState({ passwordAlert: false })
            this.toggleModal()
        } catch(err) {
            console.log(err)
            this.setState({ passwordAlert: true })
            setTimeout(() => this.setState({ passwordAlert: false }), 3000)
        }
    }

    toggleModal = () => {
        this.setState({ isPasswordModalVisible: !this.state.isPasswordModalVisible })
    }

    render() {
        const { user } = this.state
        const birthday = new Date(user.birthday)
        const birthdayText = birthday.getFullYear() + '年' + birthday.getMonth() + '月' + birthday.getDate() + '日'
        return(
            <SafeAreaView style={{ flex: 1 }}>
                <Modal isVisible={this.state.isPasswordModalVisible}>
                    <View style={styles.modalContainerView}>
                        <View style={styles.modalInnerView}>
                            <Text style={styles.modalText}>パスワードの再設定に成功しました。</Text>
                            <View style={styles.modalButtonView}>
                                <Button
                                    title='OK'
                                    onPress={() => this.toggleModal()}
                                    buttonStyle={{ borderRadius: 50, width: wp('25%'), height: hp('6%'), backgroundColor: '#7389D9' }}
                                    titleStyle={{ fontSize: 14, color: 'white' }}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
                <KeyboardAwareScrollView style={styles.scrollView}>
                    <View style={styles.innerContainer}>
                        <View style={styles.formView}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.titleText}>名前</Text>
                                <Text style={styles.mustText}>必須</Text>
                            </View>
                            <TextInput
                                placeholder={user.name}
                                style={styles.textInput}
                                editable={false}
                            />
                            <TextInput
                                placeholder={user.nameKana}
                                style={styles.textInput}
                                editable={false}
                            />
                        </View>
                        <View style={styles.formView}>
                            <Text style={styles.titleText}>性別</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Icon.Button
                                    name='check-circle'
                                    backgroundColor='white'
                                    iconStyle={{ color: (user.gender === 'male') ? '#7389D9' : 'white' }}
                                >
                                    <Text style={{ color: 'black' }}>男性</Text>
                                </Icon.Button>
                                <Icon.Button
                                    name='check-circle'
                                    backgroundColor='white'
                                    iconStyle={{ color: (user.gender === 'female') ? '#7389D9' : 'white' }}                                    style={{ marginLeft: wp('5%') }}
                                >
                                    <Text style={{ color: 'black' }}>女性</Text>
                                </Icon.Button>
                                <Icon.Button
                                    name='check-circle'
                                    backgroundColor='white'
                                    iconStyle={{ color: (user.gender === 'other') ? '#7389D9' : 'white' }}                                    style={{ marginLeft: wp('5%') }}
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
                            <TextInput
                                placeholder={user.postalCode}
                                style={styles.textInput}
                                editable={false}
                            />
                            <TextInput
                                placeholder={user.address}
                                style={styles.textInput}
                                editable={false}
                            />
                        </View>
                        {Platform.OS === 'android' ? null
                        :
                            <View style={styles.formView}>
                                <Text style={styles.titleText}>生年月日</Text>
                                <TextInput
                                    placeholder={birthdayText}
                                    style={styles.textInput}
                                    editable={false}
                                />
                            </View>
                        }
                        <View style={styles.formView}>
                            <Text style={styles.titleText}>電話番号</Text>
                            <TextInput
                                placeholder={user.phoneNumber}
                                style={styles.textInput}
                                editable={false}
                            />
                        </View>
                        <View style={styles.formView}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.titleText}>メールアドレス</Text>
                                <Text style={styles.mustText}>必須</Text>
                            </View>
                            <TextInput
                                placeholder={user.id}
                                style={styles.textInput}
                                editable={false}
                            />
                        </View>
                        <View style={styles.formView}>
                            <Text style={styles.titleText}>身長</Text>
                            <TextInput
                                placeholder={user.height + 'cm'}
                                style={styles.textInput}
                                editable={false}
                            />
                        </View>
                        <View style={styles.changeButtonView}>
                            <Button
                                title='情報を変更する →'
                                buttonStyle={styles.changeButtonStyle}
                                titleStyle={styles.changeTitleStyle}
                                onPress={() => this.navigateEditPage()}
                            />
                        </View>
                        <View style={{ height: hp('8%')}}></View>
                        {/* アラートView */}
                        <View style={{ flexDirection: 'row', display: this.state.passwordAlert ? 'flex' : 'none' }}>
                                <Text style={{ marginLeft: wp('2%'), color: '#A60000' }}>パスワードの変更に失敗しました。</Text>
                            </View>
                        <View style={styles.formView}>
                            <Text style={styles.titleText}>現在のパスワード</Text>
                            <TextInput
                                style={styles.textInput}
                                secureTextEntry={true}
                                onChangeText={val => this.setState({ nowPassword: val })}
                            />
                        </View>
                        <View style={styles.formView}>
                            <Text style={styles.titleText}>変更後のパスワード</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder='半角英数字8文字以上'
                                onChangeText={val => this.setState({ newPassword: val })}
                                secureTextEntry={true}
                            />
                        </View>
                        <View style={styles.changeButtonView}>
                            <Button
                                title='パスワードを再設定する →'
                                buttonStyle={styles.resetPasswordButtonStyle}
                                titleStyle={styles.resetPasswordButtonTitleStyle}
                                onPress={() => this.onPressResetPassword()}
                            />
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
        marginBottom: hp('3%'),
        fontSize: 15
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
        marginTop: hp('6%'),
        shadowColor: 'black',
        shadowOffset: { width: 10, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        borderRadius: 30,
    },
    modalContainerView: {
        backgroundColor: 'white',
        width: wp('70%'),
        height: hp('30%'),
        left: wp('10%'),
        textAlign: 'center',
        borderRadius: 50
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
        marginTop: hp('2%')
    },
    textInput: {
        padding: wp('2%'),
        borderBottomColor: 'silver',
        borderBottomWidth: 1.3,
        marginTop: hp('2%'),
        fontSize: 20
    },
    changeButtonStyle: {
        borderRadius: 50,
        width: wp('46%'),
        height: hp('8%'),
        backgroundColor: 'white',
        marginLeft: wp('32%'),
    },
    changeTitleStyle: {
        color: '#7389D9',
        fontSize: 16,
        fontWeight: 'bold'
    },
    resetPasswordButtonStyle: {
        borderRadius: 50,
        width: wp('62%'),
        height: hp('8%'),
        backgroundColor: 'white',
        marginLeft: wp('20%'),
    },
    resetPasswordButtonTitleStyle: {
        color: '#7389D9',
        fontSize: 16,
        fontWeight: 'bold'
    }
})

