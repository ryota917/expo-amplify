import React from 'react';
import { StyleSheet, Text, View, Picker } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API, graphqlOperation } from 'aws-amplify';
//import * as Query from '../../src/graphql/queries';
import { COLOR } from './Color';

export default class SearchConditionModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedColor: null
        }
    }
    static navigationOptions = ({navigation: { navigate }}) => ({
        title: '条件検索画面',
        headerLeft:() => <Icon name="angle-left" size={28} onPress={()=>{navigate('ItemTab')}} style={{paddingLeft:20}}/>
    });

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff" }}>
                <Picker
                style={{ width: 200, backgroundColor: '#ffffff'}}
                itemStyle={{ color: 'blue'}}
                selectedValue={this.state.selectedColor}
                onValueChange={(value) => {
                    this.setState({ selectedColor: value});
                }}
            >
                <Picker.Item label='赤' value='RED'/>
                <Picker.Item label='青' value='BLUE'/>
            </Picker>
            </View>
        );
    }
}