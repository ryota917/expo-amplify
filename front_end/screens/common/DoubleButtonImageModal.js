import React from 'react'
import { Platform, Image, Text, View, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'
import { Button } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

const DoubleButtonImageModal = (props) => {
    const {
        isModalVisible,
        onPressLeftButton,
        onPressRightButton,
        image,
        smallText,
        bigText,
        leftButtonText,
        rightButtonText,
    } = props
    return(
        <Modal isVisible={isModalVisible}>
            <View style={styles.modalContainerView}>
                <View style={styles.modalInnerView}>
                    <Image source={image} style={styles.image}/>
                    <Text style={styles.modalBigText}>{bigText}</Text>
                    <Text style={styles.modalSmallText}>{smallText}</Text>
                        {rightButtonText ?
                            <View style={styles.modalButtonView}>
                                <Button
                                    title={leftButtonText}
                                    onPress={() => onPressLeftButton()}
                                    buttonStyle={styles.modalLeftButtonStyle}
                                    titleStyle={styles.modalLeftTitleStyle}
                                />
                                <Button
                                    title={rightButtonText}
                                    onPress={() =>  onPressRightButton()}
                                    buttonStyle={styles.modalRightButtonStyle}
                                    titleStyle={styles.modalRightTitleStyle}
                                />
                            </View>
                        :
                            <View style={styles.modalButtonView}>
                                <Button
                                    title={leftButtonText}
                                    onPress={() => onPressLeftButton()}
                                    buttonStyle={styles.modalLeftButtonStyle}
                                    titleStyle={styles.modalLeftTitleStyle}
                                />
                            </View>
                        }
                </View>
            </View>
        </Modal>
    )
}

let styles

if(Platform.isPad) {
    styles = StyleSheet.create({
        modalContainerView: {
            backgroundColor: 'white',
            width: wp('60%'),
            height: hp('70%'),
            left: wp('15%'),
            textAlign: 'center',
        },
        modalInnerView: {
            width: wp('40%'),
            left: wp('10%'),
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        },
        image: {
            width: wp('25%'),
            height: wp('25%'),
            resizeMode: 'contain'
        },
        modalBigText: {
            lineHeight: 26,
            letterSpacing: 3,
            width: wp('65%'),
            marginTop: hp('4%'),
            marginBottom: hp('3%'),
            fontSize: 22,
            textAlign: 'center'
        },
        modalSmallText: {
            fontSize: 18,
            lineHeight: 22,
            letterSpacing: 3,
            marginBottom: hp('2%'),
            fontWeight: '400',
            textAlign: 'center'
        },
        modalButtonView: {
            marginTop: hp('2%')
        },
        modalLeftButtonStyle: {
            width: wp('40%'),
            borderRadius: 60,
            height: hp('7%'),
            backgroundColor: '#7389D9',
            marginBottom: hp('1%')
        },
        modalLeftTitleStyle: {
            fontSize: 20,
            color: 'white',
        },
        modalRightButtonStyle: {
            backgroundColor: 'white',
            height: hp('7%'),
        },
        modalRightTitleStyle: {
            fontSize: 20,
            color: '#7389D9'
        },
    })
} else {
    styles = StyleSheet.create({
        modalContainerView: {
            backgroundColor: 'white',
            width: wp('80%'),
            height: hp('70%'),
            left: wp('5%'),
            textAlign: 'center',
        },
        modalInnerView: {
            width: wp('70%'),
            left: wp('5%'),
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        },
        image: {
            width: wp('35%'),
            height: wp('35%'),
            resizeMode: 'contain'
        },
        modalBigText: {
            lineHeight: 19,
            letterSpacing: 1.3,
            width: wp('65%'),
            marginTop: hp('4%'),
            marginBottom: hp('3%'),
            fontSize: 16,
            textAlign: 'center'
        },
        modalSmallText: {
            fontSize: 11,
            lineHeight: 13,
            letterSpacing: 1,
            marginBottom: hp('2%'),
            fontWeight: '400',
            textAlign: 'center'
        },
        modalButtonView: {
            marginTop: hp('2%')
        },
        modalLeftButtonStyle: {
            width: wp('70%'),
            borderRadius: 30,
            height: hp('7%'),
            backgroundColor: '#7389D9',
            marginBottom: hp('1%')
        },
        modalLeftTitleStyle: {
            fontSize: 14,
            color: 'white',
        },
        modalRightButtonStyle: {
            backgroundColor: 'white',
            height: hp('7%'),
        },
        modalRightTitleStyle: {
            fontSize: 14,
            color: '#7389D9'
        },
    })
}

export default DoubleButtonImageModal