import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Image, Card, Button } from 'react-native-elements';
import { API, graphqlOperation } from 'aws-amplify';

export default class BoxTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cartItems: []
        }
    }

    static navigationOptions = ({navigation}) => ({
        title: 'ボックス',
        headerLeft: () => <Icon name="bars" size={24} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft:20}}/>,
    });

    componentDidMount() {
        this.fetchCartItems()
    }

    fetchCartItems = async () => {
        try {
            const res = await API.graphql(graphqlOperation(Query.searchItems, {}))
            console.log(res)
            this.setState({cartItems: res.data.searchItems.items})
        } catch(e) {
            console.log(e);
        }
    }

    render() {
        return(
        <ScrollView style={{flex: 1}}>
            {this.state.cartItems.map((ele, i) => {
                return <Card key={i}>
                    <Card.Title>{ele.name}</Card.Title>
                    <Card.Divider/>
                    <Card.Image style={styles.image} source={{ uri: ele.image_url }} />
                    <View key={i}>
                        <Text>{ele.size}</Text>
                        <Button title='press me for detail' onPress={() => this.props.navigation.navigate('ItemDetail', { item: ele })}/>
                        <Button title='delete' />
                    </View>
                </Card>
            })}
        </ScrollView>

        )
    }
}