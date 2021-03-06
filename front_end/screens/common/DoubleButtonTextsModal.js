import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'
import { Button } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

const DoubleButtonTextsModal = (props) => {
    const {
        isModalVisible,
        onPressLeftButton,
        onPressRightButton,
        bigText,
        smallText,
        leftButtonText,
        rightButtonText
    } = props
    return(
        <Modal isVisible={isModalVisible}>
            <View style={styles.modalContainerView}>
                <View style={styles.modalInnerView}>
                    <Text style={styles.modalText}>{bigText}</Text>
                    <Text style={styles.modalSmallText}>{smallText}</Text>
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
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainerView: {
        backgroundColor: 'white',
        width: wp('70%'),
        height: hp('30%'),
        left: wp('10%'),
        textAlign: 'center',
        borderRadius: 15
    },
    modalInnerView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalText: {
        width: wp('60%'),
        marginBottom: hp('2%'),
        textAlign: 'center',
        letterSpacing: 1
    },
    modalSmallText: {
        fontSize: 12,
        textAlign: 'center',
        letterSpacing: 1,
    },
    modalButtonView: {
        flexDirection: 'row',
        marginTop: hp('2%')
    },
    modalLeftButtonStyle: {
        borderRadius: 30,
        width: wp('25%'),
        height: hp('7%'),
        backgroundColor: '#333333'
    },
    modalLeftTitleStyle: {
        fontSize: 14,
        color: 'white',
    },
    modalRightButtonStyle: {
        marginLeft: wp('3%'),
        borderRadius: 30,
        width: wp('25%'),
        height: hp('7%'),
        backgroundColor: '#7389D9'
    },
    modalRightTitleStyle: {
        fontSize: 14,
        color: 'white'
    },
})

export default DoubleButtonTextsModal