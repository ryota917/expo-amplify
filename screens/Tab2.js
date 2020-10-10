import React from 'react';
import { View, Text, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Tab2 extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: 'タブ1のナビゲーショんオプション',
        headerLeft:(
            <Icon name="bars" size={24} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft:20}}/>
        ),
    });

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Tab2</Text>
            </View>
        );
    }
}
