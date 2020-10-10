import React from 'react';
import { View, Text, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Single2 extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: 'シングル2',
        headerLeft:(
            <Icon name="bars" size={24} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft:20}}/>
        ),
    });

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Single2</Text>
            </View>
        );
    }
}
