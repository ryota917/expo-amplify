import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

export const FourthTutorial = (props) => {
    return(
        <View>
            <Image
                source={require('pretapo/assets/fourth-tutorial.png')}
                style={styles.image}
            />
            <View style={styles.bottonContainer}>
                <Button
                    title='始める'
                    buttonStyle={styles.topButtonStyle}
                    titleStyle={styles.topTitleStyle}
                    onPress={props.onPressStartButton}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        top: wp("5%"),
        width: wp('75%'),
        height: hp('45%'),
        resizeMode: 'contain'
    },
    bottonContainer: {
        marginTop: 35,
        height: 100,
        alignItems: 'center'
    },
    topButtonStyle: {
        alignItems: 'center',
        width: 130,
        borderRadius: 60,
        height: 45,
        backgroundColor: '#7389D9',
        marginBottom: hp('1%'),
        alignItems: 'center'
    },
    topTitleStyle: {
        fontSize: 16,
        color: 'white',
    }
})