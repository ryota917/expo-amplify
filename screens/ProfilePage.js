import React from 'react'
import { Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

export default class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
    }

    static navigationOptions = ({navigation}) => ({
        title: 'ボックス',
        headerLeft: () => <Icon name="bars" size={24} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft:20}}/>,
    });

    render() {
        return(
            <View>
                <Text>プロフィール</Text>
            </View>
        )
    }
}