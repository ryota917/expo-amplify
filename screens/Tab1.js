import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API, graphqlOperation } from 'aws-amplify';
import * as Query from '../src/graphql/queries'
import { Image, Card, Button } from 'react-native-elements';
//native-baseがエラーが出てコンパイルできないため一旦react-native-elementsを使うことにする
//import { Container, Content, Card, CardItem } from 'native-base';
//import axios from 'axios';

export default class Tab1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: []
        }
    }

    componentDidMount() {
        this.fetchItems();
    }

    static navigationOptions = ({navigation}) => ({
        title: 'アイテム',
        headerLeft:(
            <Icon name="bars" size={24} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft:20}}/>
        ),
    });

    fetchItems = async () => {
        try {
            const res = await API.graphql(graphqlOperation(Query.searchItems, {}))
            console.log(res)
            this.setState({items: res.data.searchItems.items})
        } catch(e) {
            console.log(e);
        }
    }

    render() {
        return (
            <ScrollView style={{flex: 1}}>
                {this.state.items.map((ele, i) => {
                    return <Card>
                        <Card.Title>{ele.name}</Card.Title>
                        <Card.Divider/>
                        <View key={i} onPress={() => this.props.navigation.navigate('Hoge')}>
                            <Image style={styles.image} source={{ uri: ele.image_url }}/>
                            <Text>{ele.size}</Text>
                        </View>
                    </Card>
                })}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        width: 220,
        height: 220
    },
    image: {
        width: 200,
        height: 200,
        overflow: 'hidden'
    }
})
