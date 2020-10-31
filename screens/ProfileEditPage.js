import React from 'react'
import { Text, View ,ScrollView, Button, TextInput} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import ProfileForm from './profile/profileForm'
import {figmaHp, figmaWp} from "../src/utils/figmaResponsiveWrapper"

export default class ProfileEditPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userFamilyNameKanji: "高山",
            userFirstNameKanji: "眞太郎",
            userFamilyNameKatakana: "タカヤマ",
            userFirstNameKatakana: "シンタロウ",
            userSex: "male",
            addressNumber: "0000000",
            address: "京都府京都市",
            birthDate: "2020/10/5",
            phoneNumber: "090-1234-5678",
            mailAdress: "pretapo.com",
            userTall: 160,
            editable: true,
            password: "password"
        }
        // TODO:User情報の取得
    }

    static navigationOptions = ({navigation}) => ({
        title: 'ボックス',
        headerLeft: () => <Icon name="bars" size={24} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft:20}}/>,
    });

    render() {
        return(
            <View>
                <ScrollView style={{height:hp.responsive("85%")}}>
                    <ProfileForm
                        editable={true}
                        userInfo={this.state}
                        handleFormChange={(stateName, val) => {this.setState({[stateName]: val})}}
                    />
                    <Button title="情報を変更する→" onPress={()=>this.props.navigation.navigate("ProfileConfirmStack", {userInfo: this.state})}/>
                    {/* TODO: 情報の更新 */}
                    <TextInput defaultValue={this.state.password} secureTextEntry={true} onChangeText={password => this.setState({"password":password})}/>
                    <Button title="パスワードを変更する→"/>
                    {/* TODO: パスワードの変更 */}
                </ScrollView>
            </View>
        )
    }
}
const hp = new figmaHp(812);
const wp = new figmaWp(375);

