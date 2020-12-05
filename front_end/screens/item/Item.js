import React, { PureComponent } from 'react'
import { Platform, StyleSheet, TouchableHighlight, View } from 'react-native'
import { Card } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'

export default class Item extends PureComponent {
    render() {
        const { item, navigation, detailPage } = this.props

        return(
            <View style={styles.container}>
                <TouchableHighlight
                    onPress={() => navigation.navigate(detailPage, { item: item })}
                    underlayColor='white'
                >
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
                        {/* {item.brand ?
                            <View>
                                <Card.Title style={styles.brandText}>
                                    {item.brand}
                                </Card.Title>
                                <Card.Title style={styles.nameText}>
                                    {item.name}
                                </Card.Title>
                            </View>
                        :
                            null
                        } */}
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
}

let styles

if(Platform.isPad) {
    styles = StyleSheet.create({
        container: {
            width: wp('32.8%'),
            backgroundColor: 'white',
            marginHorizontal: 1.5,
        },
        itemImage: {
            width: wp('32.6%'),
            height: wp('44%')
        },
        brandText: {
            color: '#7389D9',
            marginTop: wp('1.5%'),
            paddingLeft: wp('1%'),
            paddingRight: wp('1%'),
            textAlign: 'center',
            width: wp('33%'),
        },
        nameText: {
            paddingLeft: wp('1%'),
            paddingRight: wp('1%'),
            textAlign: 'center',
            width: wp('33%'),
            fontSize: 20,
        }
    })
} else {
    styles = StyleSheet.create({
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
            marginTop: -wp('2%'),
            width: wp('33%'),
            fontSize: 12,
        }
    })
}