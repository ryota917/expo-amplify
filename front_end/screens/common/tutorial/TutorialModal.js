import React, { useRef, useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Swiper from 'react-native-swiper'
import { FirstTutorial } from 'pretapo/front_end/screens/common/tutorial/FirstTutorial'
import { SecondTutorial } from 'pretapo/front_end/screens/common/tutorial/SecondTutorial'
import { ThirdTutorial } from 'pretapo/front_end/screens/common/tutorial/ThirdTutorial'
import { FourthTutorial } from 'pretapo/front_end/screens/common/tutorial/FourthTutorial'

const TutorialModal = (props) => {
    const { isModalVisible, toggleTutorial } = props
    const swiperRef = useRef()

    return(
        <Modal isVisible={isModalVisible}>
            <View style={styles.container}>
                <Swiper
                    style={styles.swiper}
                    activeDotColor='#008f9a'
                    loop={false}
                    ref={swiperRef}
                >
                    <FirstTutorial
                        onPressNextButton={() => swiperRef.current.scrollBy(1)}
                        onPressSkipButton={() => toggleTutorial()}
                    />
                    <SecondTutorial
                        onPressNextButton={() => swiperRef.current.scrollBy(1)}
                        onPressSkipButton={() => toggleTutorial()}
                    />
                    <ThirdTutorial
                        onPressNextButton={() => swiperRef.current.scrollBy(1)}
                        onPressSkipButton={() => toggleTutorial()}
                    />
                    <FourthTutorial
                        onPressStartButton={() => toggleTutorial()}
                    />
                </Swiper>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        left: wp('5%'),
        width: wp("80%"),
        height: hp('70%'),
        padding: 15
    },
    swiper: {
        height: hp('50%')
    }
})

export default TutorialModal