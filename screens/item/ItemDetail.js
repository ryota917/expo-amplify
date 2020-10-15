import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Image, Button } from 'react-native-elements';
import * as gqlMutations from '../../src/graphql/mutations'

export default class ItemDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: this.props.navigation.state.params.item
        }
    }

    static navigationOptions = ({navigation: { navigate }}) => ({
        title: 'アイテム詳細画面',
        headerLeft:() => <Icon name="angle-left" size={28} onPress={()=>{navigate('ItemTab')}} style={{paddingLeft:20}}/>
    });

    saveItemCart = () => {
        console.log('カートに入れるボタンが押されました')
        
        //スマホ版専用のアラートなのでWebブラウザのsimulatorではAlertが出ない
        Alert.alert(
            'Button pressed',
            'You did it',
        );
    }

    render() {
        return(
            <View>
                <Image source={{ uri: this.state.item.image_url }} style={styles.image}></Image>
                <Text>{this.state.item.name}</Text>
                <Button icon={<Icon name='shopping-cart' size={30} color='white'/>} title='カートに入れる' onPress={this.saveItemCart}/>
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