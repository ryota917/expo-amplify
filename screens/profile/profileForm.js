import React from 'react'
import { TextInput, View, Text, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { CheckBox } from 'react-native-elements'


export default class ProfileForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userFamilyNameKanji: "高山",
            userFirstNameKanji: "眞太郎",
            userFamilyNameKatakana: "タカヤマ",
            userFirstNameKatakana: "シンタロウ",
            userSex: "male",
            adressNumber: "0000000",
            adress: "京都府京都市",
            birthDate: "2020/10/5",
            phoneNumber: "090-1234-5678",
            mailAdress: "pretapo.com",
            userTall: 160,
            editable: true
        }
    }

    render() {
        return(
            <View>
                <Text>{"お名前"}</Text>
                <TextInput
                    defaultValue={this.state.userFamilyNameKanji}
                    editable={this.state.editable}
                    style={styles.normalForm}
                />
                 <TextInput
                    defaultValue={this.state.userFirstNameKanji}
                    editable={this.state.editable}
                    style={styles.normalForm}
                />
                 <TextInput
                    defaultValue={this.state.userFamilyNameKatakana}
                    editable={this.state.editable}
                    style={styles.normalForm}
                />
                 <TextInput
                    defaultValue={this.state.userFirstNameKatakana}
                    editable={this.state.editable}
                    style={styles.normalForm}
                />
                <Text>{"性別"}</Text>
                <SexSelect/>
                <Text>{"お届け先"}</Text>
                <TextInput
                    defaultValue={this.state.adressNumber}
                    editable={this.state.editable}
                    style={styles.normalForm}
                />
                <TextInput
                    defaultValue={this.state.adress}
                    editable={this.state.editable}
                    style={styles.normalForm}
                />
                <Text>{"生年月日"}</Text>
                <TextInput
                    defaultValue={this.state.birthDate}
                    editable={this.state.editable}
                    style={styles.normalForm}
                />
                <Text>{"電話番号"}</Text>
                <TextInput
                    defaultValue={this.state.phoneNumber}
                    editable={this.state.editable}
                    style={styles.normalForm}
                />
                <Text>{"メールアドレス"}</Text>
                <TextInput
                    defaultValue={this.state.mailAdress}
                    editable={this.state.editable}
                    style={styles.normalForm}
                />
                <Text>{"身長"}</Text>
                <TextInput
                    defaultValue={this.state.userTall}
                    editable={this.state.editable}
                    style={styles.normalForm}
                />

            </View>
        )
    }
}

class SexSelect extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isMale: false,
            isFemale: false,
            isOtherSex: false,
            editable: this.props.editable,
        }
        switch(this.props.sex){
            case "male":{
                this.state.isMale = true;
                break;
            }
            case "female":{
                this.state.isFemale = true;
                break;
            }
            case "other":{
                this.state.isOtherSex = true;
                break;
            }
        }
    }

    handleChangeCheckboxState = (isMale = false, isFemale = false, isOtherSex = false) => {
        if(this.state.editable){
            this.setState({
                isMale: isMale,
                isFemale: isFemale,
                isOtherSex: isOtherSex
            })
        }
    }

    render(){
        return(
            <View style={{flexDirection: "row", justifyContent: "space-around"}}>
                <CheckBox
                    title="男性"
                    checked={this.state.isMale}
                    onPress={() => this.handleChangeCheckboxState(isMale=true)}
                />
                <CheckBox
                        title="女性"
                        checked={this.state.isMale}
                        onPress={() => this.handleChangeCheckboxState(isFeMale=true)}
                />
                <CheckBox
                        title="その他"
                        checked={this.state.isMale}
                        onPress={() => this.handleChangeCheckboxState(isOtherSex=true)}
                />
            </View>
        )
    }
}


const styles = StyleSheet.create({
})
