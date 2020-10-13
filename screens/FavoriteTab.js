import React from 'react';
import { View, StyleSheet, Text, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class FavoriteTab extends React.Component {
    constructor(props) {
        super(props);
    }

    static navigationOptions = ({navigation}) => ({
        title: 'お気に入り',
        headerLeft:() => <Icon name="bars" size={24} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft:20}}/>,
    });

    render() {
        return(
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>アップデートをお待ちください。</Text>
            </View>
        )
    }
}