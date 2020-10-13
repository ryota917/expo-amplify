import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Image } from 'react-native-elements';

export default class ItemDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: this.props.navigation.state.params.item
        }
    }

    static navigationOptions = ({navigation: { navigate }}) => ({
        title: 'アイテム詳細画面',
        headerLeft:(
            <Icon name="angle-left" size={28} onPress={()=>{navigate('Tab1')}} style={{paddingLeft:20}}/>
        ),
    });

    render() {
        return(
            <View>
                <Image source={this.state.item.image_url} style={styles.image}></Image>
                <Text>{this.state.item.name}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    image: {
        width: 400,
        height: 400,
        overflow: 'hidden'
    }
})
