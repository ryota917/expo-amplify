import React, { useRef, useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'
import { Button } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Swiper from 'react-native-swiper'
import { FirstTutorial } from 'pretapo/front_end/screens/common/tutorial/FirstTutorial'
import { SecondTutorial } from 'pretapo/front_end/screens/common/tutorial/SecondTutorial'
import { ThirdTutorial } from 'pretapo/front_end/screens/common/tutorial/ThirdTutorial'
import { FourthTutorial } from 'pretapo/front_end/screens/common/tutorial/FourthTutorial'

const TutorialModal = (props) => {
    const [index, setIndex] = useState(0)
    const { isModalVisible, toggleTutorial } = props
    const swiperRef = useRef()

    useEffect((idx) => {
        setIndex(idx)
    }, [setIndex])

    return(
        <Modal isVisible={isModalVisible}>
            <View style={styles.container}>
                <Swiper
                    style={styles.swiper}
                    activeDotColor='#008f9a'
                    loop={false}
                    ref={swiperRef}
                    onIndexChanged={idx => setIndex(idx)}
                >
                    <FirstTutorial />
                    <SecondTutorial />
                    <ThirdTutorial />
                    <FourthTutorial />
                </Swiper>
                {index === 3 ?
                    <View style={styles.bottonContainer}>
                        <Button
                            title='始める'
                            buttonStyle={styles.topButtonStyle}
                            titleStyle={styles.topTitleStyle}
                            onPress={toggleTutorial}
                        />
                    </View>
                :
                    <View style={styles.bottonContainer}>
                        <Button
                            title='次へ'
                            buttonStyle={styles.topButtonStyle}
                            titleStyle={styles.topTitleStyle}
                            onPress={() => swiperRef.current.scrollBy(1)}
                        />
                        <Button
                            title='スキップ'
                            buttonStyle={styles.bottomButtonStyle}
                            titleStyle={styles.bottomTitleStyle}
                            onPress={toggleTutorial}
                        />
                    </View>
                }
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
    },
    bottonContainer: {
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
    },
    bottomButtonStyle: {
        backgroundColor: 'white',
        height: 50,
    },
    bottomTitleStyle: {
        fontSize: 16,
        color: '#7389D9'
    },
})

export default TutorialModal