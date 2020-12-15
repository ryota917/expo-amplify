import React from 'react'
import { Image, StyleSheet } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

export const SecondTutorial = () => {
    return(
        <Image
            source={require('pretapo/assets/second-tutorial.png')}
            style={styles.image}
        />
    )
}

const styles = StyleSheet.create({
    image: {
        top: wp("5%"),
        width: wp('75%'),
        height: hp('45%'),
        resizeMode: 'contain'
    }
})