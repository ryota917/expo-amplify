import React from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class CartTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemCart: [],
            cartSize: 0
        }
    }

    static navigationOptions = ({navigation}) => ({
        title: 'ボックス',
        headerLeft: () => <Icon name="bars" size={24} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft:20}}/>,
    });

    componentDidMount() {
    }

    render() {
        return(
            <View>
                <Text>相談画面です</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({})
