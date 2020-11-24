import React from 'react'
import { Image, View, ScrollView, StyleSheet, Text, TouchableHighlight } from 'react-native'
import Swiper from 'react-native-swiper'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const ItemDetailScreen = (props) => {
    const { item, isFavorited, isRental, saveItemToFavorite, deleteItemFromFavorite } = props

    let bigCategoryText = ''
    switch(item.bigCategory[0]) {
        case 'OUTER':
            bigCategoryText = 'アウター'
            break;
        case 'TOPS':
            bigCategoryText = 'トップス'
            break;
        case 'BOTTOMS':
            bigCategoryText = 'ボトムス'
            break;
    }

    const imagesDom = item.imageURLs.map((imgUrl, idx) =>
        <FastImage key={idx} source={{ uri: imgUrl }} style={{ width: wp('100%'), height: wp('133%'), resizeMode: 'contain' }}/>
    )

    return(
        <ScrollView style={styles.scrollView}>
            <View style={styles.innerContainer}>
                <View style={styles.imagesView}>
                    <Swiper
                        style={styles.swiper}
                        showButtons={true}
                        activeDotColor='#7389D9'
                        dotStyle={{ top: hp('1%')}}
                        activeDotStyle={{ top: hp('1%')}}
                        loop={false}
                    >
                        {imagesDom}
                    </Swiper>
                </View>
                <View style={styles.textView}>
                    <View style={styles.flexRowView}>
                        <View style={styles.titleView}>
                            {/* ブランド */}
                            <View style={styles.brandView}>
                                <Text style={styles.brandText}>{item.brand}</Text>
                            </View>
                            {/* アイテム名 */}
                            <View style={styles.nameView}>
                                <Text style={styles.nameText}>{item.name}</Text>
                            </View>
                            {/* サイズ */}
                            <View style={styles.sizeView}>
                                <Text style={styles.sizeText}>{item.size}サイズ</Text>
                            </View>
                            {/* カテゴリ名 */}
                            <View style={styles.categoryView}>
                                <Text style={styles.categoryText}>{bigCategoryText}</Text>
                            </View>
                        </View>
                        {/* お気にいりボタン */}
                        <TouchableHighlight
                            style={styles.iconView}
                            onPress={isFavorited ? () => deleteItemFromFavorite() : () => saveItemToFavorite()}
                            underlayColor='white'
                        >
                            {/* <Image
                                source={isFavorited ? require('../../assets/bookmark-black.png') : require('../../assets/bookmark-white.png')}
                                style={{ resizeMode: 'contain', width: wp('10%'), height: wp('10%') }}
                            /> */}
                            <Icon
                                name={isFavorited ? 'bookmark-minus' : 'bookmark-minus-outline' }
                                size={40}
                            />
                        </TouchableHighlight>
                    </View>
                    {/* 長さ */}
                    {item.bigCategory[0] === 'BOTTOMS' ?
                        <View style={styles.lengthView}>
                            <Image source={require('../../assets/bottoms.png')} style={styles.lengthImage} />
                            <View style={styles.sizeTextView}>
                                <Text style={styles.lengthText}>①ウエスト {item.waist}cm</Text>
                                <Text style={styles.lengthText}>②ヒップ {item.hip}cm</Text>
                                <Text style={styles.lengthText}>③股上 {item.rise}cm</Text>
                                <Text style={styles.lengthText}>③股下 {item.inseam}cm</Text>
                                <Text style={styles.lengthText}>③裾幅 {item.hemWidth}cm</Text>
                            </View>
                        </View>
                    :
                        <View style={styles.lengthView}>
                            <Image source={require('../../assets/vector.png')} style={{ width: wp('30%'), height: wp('30%'), resizeMode: 'contain' }} />
                            <View style={styles.sizeTextView}>
                                <Text style={styles.lengthText}>①着丈 {item.dressLength}cm</Text>
                                <Text style={styles.lengthText}>②身幅 {item.dressWidth}cm</Text>
                                <Text style={styles.lengthText}>③袖幅 {item.sleeveLength}cm</Text>
                            </View>
                        </View>
                    }
                    {/* 状態 */}
                    <View style={styles.stateView}>
                        <Text style={styles.stateTitleText}>状態</Text>
                        <View style={styles.stateInnerView}>
                            <Text style={styles.stateRankText}>{item.rank}ランク</Text>
                            <Text style={styles.stateDescriptionText}>{item.stateDescription}</Text>
                        </View>
                    </View>
                    {/* 説明 */}
                    {/* <View style={styles.descriptionView}>
                        <Text style={styles.descriptionTitleText}>説明</Text>
                        <Text style={styles.descriptionText}>{item.description}</Text>
                    </View> */}
                </View>
                <View style={{ height: isRental ? hp('20%') : hp('15%') }}></View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: 'white'
    },
    imagesView: {
        width: wp('100%'),
        height: wp('133%')
    },
    textView: {
        marginTop: hp('3%'),
        width: wp('80%'),
        left: wp('10%')
    },
    flexRowView: {
        flexDirection: 'row',
    },
    titleView: {
        width: wp('80%'),
    },
    iconView: {
        right: wp('10%'),
        top: hp('4%')
    },
    brandView: {
    },
    brandText: {
        width: wp('60%'),
        marginTop: hp('2%'),
        color: '#7389D9',
        fontSize: 16
    },
    nameView: {
        width: wp('65%'),
        marginTop: hp('1%'),
        marginBottom: hp('0.5%'),
    },
    nameText: {
        fontSize: 20
    },
    sizeView: {
        marginTop: wp('1.5%'),
        marginLeft: wp('1.3%'),
    },
    sizeText: {
        fontSize: 13,
    },
    categoryView: {
        marginTop: hp('1.5%')
    },
    categoryText: {
        fontSize: 13,
        color: 'grey',
        marginLeft: wp('1%')
    },
    lengthView: {
        marginTop: hp('3%'),
        flexDirection: 'row'
    },
    sizeTextView: {
        marginLeft: wp('10%'),
        justifyContent: 'center'
    },
    lengthText: {
        marginBottom: hp('1%')
    },
    lengthImage: {
        width: wp('30%'),
        height: wp('47%'),
        resizeMode: 'contain'
    },
    stateView: {
        marginTop: hp('3%'),
        flexDirection: 'row'
    },
    stateInnerView: {
        width: wp('60%'),
        marginLeft: wp('10%')
    },
    stateTitleText: {
        fontSize: 18
    },
    stateRankText: {
        backgroundColor: '#C4C4C4',
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        width: wp('20%')
    },
    stateDescriptionText: {
        marginTop: hp('2%')
    },
    descriptionView: {
        marginTop: hp('3%')
    },
    descriptionTitleText: {
        fontSize: 18
    },
    descriptionText: {
        marginTop: hp('2%')
    }
})

export default ItemDetailScreen