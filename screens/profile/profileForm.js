import React from 'react'
import { TextInput, View, Text, StyleSheet, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { CheckBox } from 'react-native-elements'
import {figmaHp, figmaWp} from "../../src/utils/figmaResponsiveWrapper"
import { color } from 'react-native-reanimated';


export default class ProfileForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>
                    <View style={styles.normalForm}>
                        <Text>{"お名前"}</Text>
                    </View>
                    <View style={styles.normalForm}>
                        <TextInput
                            defaultValue={this.props.userInfo.userFamilyNameKanji}
                            editable={this.props.editable}
                            style={styles.formBoader}
                            textAlignVertical='top'
                            onChangeText = {val => this.props.handleFormChange("userFamilyNameKanji",val)}
                        />
                    </View>
                    <View style={styles.normalForm}>
                        <TextInput
                            defaultValue={this.props.userInfo.userFirstNameKanji}
                            editable={this.props.editable}
                            style={styles.formBoader}
                            textAlignVertical='top'
                            onChangeText = {val => this.props.handleFormChange("userFirstNameKanji",val)}
                        />
                    </View>
                    <View style={styles.normalForm}>
                        <TextInput
                            defaultValue={this.props.userInfo.userFamilyNameKatakana}
                            editable={this.props.editable}
                            style={styles.formBoader}
                            textAlignVertical='top'
                            onChangeText = {val => this.props.handleFormChange("userFamilyNameKatakana",val)}
                        />
                    </View>
                    <View style={styles.normalForm}>
                        <TextInput
                            defaultValue={this.props.userInfo.userFirstNameKatakana}
                            editable={this.props.editable}
                            style={styles.formBoader}
                            textAlignVertical='top'
                            onChangeText = {val => this.props.handleFormChange("userFirstNameKatakana",val)}
                        />
                    </View>
                    <View style={styles.normalForm}>
                        <Text>{"性別"}</Text>
                    </View>
                        <SexSelect
                            selectedSexName={this.props.userInfo.userSex}
                            handleChange = {val => this.props.handleFormChange("userSex",val)}
                        />
                    <View style={styles.normalForm}>
                        <Text>{"お届け先"}</Text>
                    </View>
                    <View style={styles.normalForm}>
                        <TextInput
                            defaultValue={this.props.userInfo.addressNumber}
                            editable={this.props.editable}
                            style={styles.formBoader}
                            textAlignVertical='top'
                            onChangeText = {val => this.props.handleFormChange("addressNumber",val)}
                        />
                    </View>
                    <View style={styles.normalForm}>
                        <TextInput
                            defaultValue={this.props.userInfo.address}
                            editable={this.props.editable}
                            style={styles.formBoader}
                            textAlignVertical='top'
                            onChangeText = {val => this.props.handleFormChange("address",val)}
                        />
                    </View>
                    <View style={styles.normalForm}>
                        <Text>{"生年月日"}</Text>
                    </View>
                    <View style={styles.normalForm}>
                        <TextInput
                            defaultValue={this.props.userInfo.birthDate}
                            editable={this.props.editable}
                            style={styles.formBoader}
                            textAlignVertical='top'
                            onChangeText = {val => this.props.handleFormChange("birthDate",val)}
                        />
                    </View>
                    <View style={styles.normalForm}>
                        <Text>{"電話番号"}</Text>
                    </View>
                    <View style={styles.normalForm}>
                        <TextInput
                            defaultValue={this.props.userInfo.phoneNumber}
                            editable={this.props.editable}
                            style={styles.formBoader}
                            textAlignVertical='top'
                            onChangeText = {val => this.props.handleFormChange("phoneNumber",val)}
                        />
                    </View>
                    <View style={styles.normalForm}>
                        <Text>{"メールアドレス"}</Text>
                    </View>
                    <View style={styles.normalForm}>
                        <TextInput
                            defaultValue={this.props.userInfo.mailAdress}
                            editable={this.props.editable}
                            style={styles.formBoader}
                            onChangeText = {val => this.props.handleFormChange("mailAdress",val)}
                        />
                    </View>
                    <View style={styles.normalForm}>
                        <Text>{"身長"}</Text>
                    </View>
                    <View style={styles.normalForm}>
                        <TextInput
                            defaultValue={this.props.userInfo.userTall}
                            editable={this.props.editable}
                            style={styles.formBoader}
                            onChangeText = {val => this.props.handleFormChange("userTall",val)}
                        />

                    </View>
            </View>
        )
    }
}

class SexSelect extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <View style={{flexDirection: "row", justifyContent: "space-around"}}>
                <CheckBox
                    title="男性"
                    checked={this.props.selectedSexName === "male"}
                    onPress={() => this.props.handleChange("male")}
                />
                <CheckBox
                    title="女性"
                    checked={this.props.selectedSexName === "female"}
                    onPress={() => this.props.handleChange("female")}
                />
                <CheckBox
                    title="その他"
                    checked={this.props.selectedSexName === "otherSex"}
                    onPress={() => this.props.handleChange("otherSex")}
                />
            </View>
        )
    }
}

const hp = new figmaHp(812);
const wp = new figmaWp(375);
const styles = StyleSheet.create({
    normalForm:{
        marginTop:hp.responsive(37),
        marginLeft: wp.responsive(46),
        marginRight: wp.responsive(41),
    },
    formBoader:{
        borderBottomWidth :1.5,
        height:hp.responsive(30),
        borderBottomColor: "gray",
    }
})
