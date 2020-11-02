import React from 'react'
import { Text, View ,ScrollView, TextInput, StyleSheet, Picker } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import { Input, Button } from 'react-native-elements'
import { Auth, API, graphqlOperation } from 'aws-amplify';
import * as gqlQueries from '../src/graphql/queries' // read
import Modal from 'react-native-modal'

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
        headerLeft: () => <Icon name="bars" size={24} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft:20}}/>,
    });

    componentDidMount = async () => {
        const currentUser = await Auth.currentAuthenticatedUser()
        const currentUserEmail = currentUser.attributes.email
        const user = await API.graphql(graphqlOperation(gqlQueries.getUser, {id: currentUserEmail}))
        this.setState({ user: user.data.getUser })
        this.props.navigation.addListener('didFocus', async () => {
            const user = await API.graphql(graphqlOperation(gqlQueries.getUser, {id: currentUserEmail}))
            this.setState({
                user: user.data.getUser,
                passwordAlert: false
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
            <View style={styles.container}>
                <Modal isVisible={this.state.isPasswordModalVisible}>
                    <View style={styles.modalContainerView}>
                        <View style={styles.modalInnerView}>
                            <Text style={styles.modalText}>パスワードの再設定に成功しました。</Text>
                            <View style={styles.modalButtonView}>
                                <Button
                                    title='OK'
                                    onPress={() => this.toggleModal()}
                                    buttonStyle={{ borderRadius: 25, width: wp('25%'), height: hp('6%'), backgroundColor: '#7389D9' }}
                                    titleStyle={{ fontSize: 14, color: 'white' }}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.innerContainer}>
                        <View style={styles.formView}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.titleText}>名前</Text>
                                <Text style={styles.mustText}>必須</Text>
                            </View>
                            <Input
                                defaultValue={user.name}
                                disabled={true}
                            />
                            <Input
                                defaultValue={user.nameKana}
                                disabled={true}
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
                            <Input
                                defaultValue={user.postalCode}
                                disabled={true}
                            />
                            <Input
                                defaultValue={user.address}
                                disabled={true}
                            />
                        </View>
                        <View style={styles.formView}>
                            <Text style={styles.titleText}>生年月日</Text>
                            <Input
                                defaultValue={birthdayText}
                                disabled={true}
                            />
                        </View>
                        <View style={styles.formView}>
                            <Text style={styles.titleText}>電話番号</Text>
                            <Input
                                defaultValue={user.phoneNumber}
                                disabled={true}
                            />
                        </View>
                        <View style={styles.formView}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.titleText}>メールアドレス</Text>
                                <Text style={styles.mustText}>必須</Text>
                            </View>
                            <Input
                                defaultValue={user.id}
                                disabled={true}
                            />
                        </View>
                        <View style={styles.formView}>
                            <Text style={styles.titleText}>身長</Text>
                            <Input
                                defaultValue={user.height}
                                disabled={true}
                            />
                        </View>
                        <View style={styles.changeButton}>
                            <Button
                                title='情報を変更する →'
                                buttonStyle={{
                                    borderRadius: 30,
                                    width: wp('46%'),
                                    height: hp('7%'),
                                    backgroundColor: 'white',
                                    marginLeft: wp('32%')
                                }}
                                titleStyle={{
                                    color: '#7389D9',
                                    fontSize: 16,
                                    fontWeight: 'bold'
                                }}
                                onPress={() => this.navigateEditPage()}
                            />
                        </View>
                        <View style={{ height: hp('8%')}}></View>
                        {/* アラートView */}
                        <View style={{ flexDirection: 'row', display: this.state.passwordAlert ? 'block' : 'none' }}>
                                <Text style={{ marginLeft: wp('2%'), color: '#A60000' }}>パスワードの変更に失敗しました。</Text>
                            </View>
                        <View style={styles.formView}>
                            <Text style={styles.titleText}>現在のパスワード</Text>
                            <Input
                                onChangeText={val => this.setState({ nowPassword: val })}
                                secureTextEntry={true}
                            />
                        </View>
                        <View style={styles.formView}>
                            <Text style={styles.titleText}>変更後のパスワード</Text>
                            <Input
                                placeholder='半角英数字8文字以上'
                                onChangeText={val => this.setState({ newPassword: val })}
                                secureTextEntry={true}
                            />
                        </View>
                        <View style={styles.changeButton}>
                            <Button
                                title='パスワードを再設定する →'
                                buttonStyle={{
                                    borderRadius: 30,
                                    width: wp('62%'),
                                    height: hp('7%'),
                                    backgroundColor: 'white',
                                    marginLeft: wp('20%'),
                                }}
                                titleStyle={{
                                    color: '#7389D9',
                                    fontSize: 16,
                                    fontWeight: 'bold'
                                }}
                                onPress={() => this.onPressResetPassword()}
                            />
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
        marginTop: hp('2%')
    }
})

