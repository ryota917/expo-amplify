import React, { PureComponent } from 'react'
import { StyleSheet, TouchableHighlight, View } from 'react-native'
import { Card } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'

export default class Item extends PureComponent {
    render() {
        const { item, navigation } = this.props
        return(
            <View style={styles.container}>
                <TouchableHighlight onPress={() => navigation.navigate('ItemDetail', { item: item })} underlayColor='white' >
                    <View>
                        <FastImage
                            source={{ uri: item.imageURLs[0] }}
                            style={styles.itemImage}
                        />
                        <Card.Title
                            style={styles.brandText}
                            >
                            {item.brand}
                        </Card.Title>
                        <Card.Title
                            style={styles.nameText}
                            >
                            {item.name}
                        </Card.Title>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: wp('32.6%'),
        backgroundColor: 'white',
        marginHorizontal: 1.5
    },
    itemImage: {
        width: wp('32.6%'),
        height: wp('44%'),
    },
    brandText: {
        color: '#7389D9',
        marginTop: wp('2%'),
        paddingLeft: wp('1%'),
        paddingRight: wp('1%'),
        textAlign: 'center',
        width: wp('33%'),
        fontSize: 10,
    },
    nameText: {
        paddingLeft: wp('1%'),
        paddingRight: wp('1%'),
        textAlign: 'center',
        marginTop: -wp('2.4%'),
        width: wp('33%'),
        fontSize: 12,
    }
})