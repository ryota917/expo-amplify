import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API, graphqlOperation } from 'aws-amplify';
import * as Query from '../../src/graphql/queries'

export default class SearchConditionModal extends React.Component {
    static navigationOptions = ({navigation: { navigate }}) => ({
        title: '条件検索画面',
        headerLeft:(
            <Icon name="angle-left" size={28} onPress={()=>{navigate('Tab1')}} style={{paddingLeft:20}}/>
        ),
    });

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff" }}>
                <Text></Text>
            </View>
        );
    }
}