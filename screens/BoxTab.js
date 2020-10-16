import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Image, Card, Button } from 'react-native-elements';
import { Auth, API, graphqlOperation } from 'aws-amplify'
import * as gqlQueries from '../src/graphql/queries' // read
import * as gqlMutations from '../src/graphql/mutations' // create, update, delete
import * as gqlSubscriptions from '../src/graphql/subscriptions' // 監視

export default class BoxTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemCart: []
        }
    }

    static navigationOptions = ({navigation}) => ({
        title: 'ボックス',
        headerLeft: () => <Icon name="bars" size={24} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft:20}}/>,
    });

    componentDidMount() {
        this.fetchItemCart()
    }

    fetchItemCart = async () => {
        const currentUser = await Auth.currentAuthenticatedUser()
        try {
            const res = await API.graphql(graphqlOperation(gqlQueries.searchItemCarts, {
                filter: {
                    cartId: {
                        eq: currentUser.username
                    }
                }
            }))
            console.log(res)
            const itemArray = []
            res.data.searchItemCarts.items.forEach(obj => itemArray.push(obj.item))
            this.setState({itemCart: itemArray})
        } catch(e) {
            console.log(e);
        }
    }

    render() {
        return(
        <ScrollView style={{flex: 1}}>
            {this.state.itemCart.map((ele, i) => {
                return <Card key={i} styles={styles.card}>
                    <Card.Title>{ele.name}</Card.Title>
                    <Card.Divider/>
                    <Card.Image style={styles.image} source={{ uri: ele.image_url }} />
                    <View key={i}>
                        <Text>{ele.size}</Text>
                        <Button title='press me for detail' style={styles.rentalButton} onPress={() => this.props.navigation.navigate('ItemDetail', { item: ele })}/>
                        <Button title='delete' />
                    </View>
                </Card>
            })}
        </ScrollView>

        )
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
    },
    rentalButton: {
        marginBottom: 20
    }
})
