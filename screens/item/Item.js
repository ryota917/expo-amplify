import React, { PureComponent } from 'react'
import { StyleSheet, TouchableHighlight, Image } from 'react-native'
import { Card } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

export default class Item extends PureComponent {
    render() {
        const { item, navigation } = this.props
        return(
            <Card
                containerStyle={styles.cardContainer}
            >
                <TouchableHighlight onPress={() => navigation.navigate('ItemDetail', { item: item })} underlayColor='white' >
                    <Image
                        source={{ uri: item.imageURLs[0] }}
                        style={styles.itemImage}
                    />
                </TouchableHighlight>
                <Card.Title
                    style={styles.brandText}
                    onPress={() => navigation.navigate('ItemDetail', { item: item })}
                >
                    {item.brand}
                </Card.Title>
                <Card.Title
                    style={styles.nameText}
                    onPress={() => navigation.navigate('ItemDetail', { item: item })}
                >
                    {item.name}
                </Card.Title>
            </Card>
        )
    }
}

const styles = StyleSheet.create({
    cardContainer: {
        padding: 0,
        margin: 0,
        width: wp('33%'),
        height: wp('63%')
    },
    itemImage: {
        width: wp('33%'),
        height: wp('44%'),
    },
    brandText: {
        color: '#7389D9',
        marginTop: hp('0.5%'),
        paddingLeft: wp('1%'),
        paddingRight: wp('1%'),
        textAlign: 'left',
        width: wp('33%'),
        fontSize: 10,
    },
    nameText: {
        paddingLeft: wp('1%'),
        paddingRight: wp('1%'),
        textAlign: 'left',
        marginTop: -hp('1%'),
        width: wp('33%'),
        fontSize: 12,
    }
})