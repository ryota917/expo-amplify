import React from 'react'
import { Text, View ,ScrollView, Button, TextInput} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import ProfileForm from './profile/profileForm'
import {figmaHp, figmaWp} from "../src/utils/figmaResponsiveWrapper"

export default class ProfileEditPage extends React.Component {
    constructor(props) {
        super(props);
        // TODO:User情報の取得
    }

    static navigationOptions = ({navigation}) => ({
        title: '登録情報の修正',
        headerLeft: () => <Icon name="bars" size={24} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft:20}}/>,
    });

    render() {
        return(
            <View>
                <ScrollView style={{height:hp.responsive("85%")}}>
                    {/* <ProfileForm
                        editable={false}
                        userInfo={this.props.navigation.state.params.userInfo}
                        handleFormChange={(stateName, val) => {}}
                    /> */}
                    <View style={{flexDirection:"row", justifyContent:"space-around"}}>
                        <Button title="戻る" onPress={()=>this.props.navigation.goBack()}/>
                        <Button title="変更確定→" onPress={()=>{/*TODO: DBの更新*/}}/>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const hp = new figmaHp(812);
const wp = new figmaWp(375);
