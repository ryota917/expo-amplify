import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'
import { Button } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

const SingleButtonModal = (props) => {
    const { isModalVisible, onPressButton, text, buttonText } = props
    return(
        <Modal isVisible={isModalVisible}>
            <View style={styles.modalContainerView}>
                <View style={styles.modalInnerView}>
                    <Text style={styles.modalText}>{text}</Text>
                    <View style={styles.modalButtonView}>
                        <Button
                            title={buttonText}
                            onPress={() => onPressButton()}
                            buttonStyle={styles.modalButtonStyle}
                            titleStyle={styles.modalTitleStyle}
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
        marginBottom: hp('2%'),
        fontWeight: '400',
        textAlign: 'center'
    },
    modalButtonView: {
        flexDirection: 'row',
        marginTop: hp('2%')
    },
    modalButtonStyle: {
        borderRadius: 25,
        width: wp('25%'),
        height: hp('6%'),
        backgroundColor: '#7389D9'
    },
    modalTitleStyle: {
        fontSize: 14,
        color: 'white'
    }
})

export default SingleButtonModal