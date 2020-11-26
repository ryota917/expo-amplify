import React from 'react';
import { Platform, StyleSheet, View, ScrollView, Text, Image, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

class SearchConditionModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            colorPulledDown: true,
            selectedColor: '',
            categoryPulledDown: true,
            selectedCategory: '',
            sizePulledDown: true,
            selectedSize: '',
            rankPulledDown: true,
            selectedRank: '',
            searchCondition: this.props.navigation.state.params?.searchCondition
        }
    }

    static navigationOptions = ({navigation: { navigate }}) => ({
        title: 'さがす',
        headerLeft:() => <Icon name="chevron-left" size={Platform.isPad ? 60 : 42} onPress={()=>{navigate('ItemTab')}} />,
        headerStyle: {
            height: hp('7%')
        }
    });

    searchWithCondition = () => {
        this.props.navigation.navigate('ItemTab', { searchCondition: this.state.searchCondition })
    }

    // color
    toggleColorView = () => {
        this.setState({ colorPulledDown: !this.state.colorPulledDown })
    }

    selectColor = (color) => {
        const searchCondition = this.state.searchCondition.slice();
        if(color === this.state.searchCondition[0]['color']) {
            searchCondition[0]['color'] = ''
            this.setState({ searchCondition: searchCondition })
        } else {
            searchCondition[0]['color'] = color
            this.setState({ searchCondition: searchCondition })
        }
    }


    // bigCategory
    toggleBigCategoryView = () => {
        this.setState({ categoryPulledDown: !this.state.categoryPulledDown })
    }

    selectBigCategory = (bigCategory) => {
        const searchCondition = this.state.searchCondition.slice();
        if(bigCategory === this.state.searchCondition[1]['bigCategory']) {
            searchCondition[1]['bigCategory'] = ''
            this.setState({ searchCondition: searchCondition })
        } else {
            searchCondition[1]['bigCategory'] = bigCategory
            this.setState({ searchCondition: searchCondition })
        }
    }

    //size
    toggleSizeView = () => {
        this.setState({ sizePulledDown: !this.state.sizePulledDown})
    }

    selectSize = (size) => {
        const searchCondition = this.state.searchCondition.slice();
        if(size === this.state.searchCondition[2]['size']) {
            searchCondition[2]['size'] = ''
            this.setState({ searchCondition: searchCondition })
        } else {
            searchCondition[2]['size'] = size
            this.setState({ searchCondition: searchCondition })
        }
    }

    //rank
    toggleRankView = () => {
        this.setState({ rankPulledDown: !this.state.rankPulledDown})
    }

    selectRank = (rank) => {
        const searchCondition = this.state.searchCondition.slice();
        if(rank === this.state.searchCondition[3]['rank']) {
            searchCondition[3]['rank'] = ''
            this.setState({ searchCondition: searchCondition })
        } else {
            searchCondition[3]['rank'] = rank
            this.setState({ searchCondition: searchCondition })
        }
    }

    returnChoiceName = (name, isSelected) => {
        return(
            <View style={styles.choiceView}>
                <Text style={[styles.choiceContentText, { color: isSelected ? 'white' : 'black' }]}>{name}</Text>
                <Text style={styles.choiceText}>選択中</Text>
                {isSelected &&
                    <Image
                        source={require('../../../assets/circle-check.png')}
                        style={styles.choiceImage}
                    />
                }
            </View>
        )
    }

    render() {
        const { searchCondition } = this.state
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView style={styles.scrollView} >
                    <View style={styles.innerContainer}>
                        {/* カテゴリ条件 */}
                        <View style={styles.conditionView}>
                            <Button
                                icon={
                                    <Icon name={this.state.categoryPulledDown ? "chevron-up" : "chevron-down" } size={Platform.isPad ? 40 : 20} style={{ color: 'grey' }}  />
                                }
                                iconRight={true}
                                title='カテゴリで検索'
                                buttonStyle={styles.dropDownButtonStyle}
                                titleStyle={styles.dropDownTitleStyle}
                                onPress={this.toggleBigCategoryView}
                            />
                            {!this.state.categoryPulledDown ? null :
                                <View>
                                    <Button
                                        icon={
                                            <Image source={require('../../../assets/tops.png')} style={styles.clothImage} />
                                        }
                                        title={this.returnChoiceName('トップス', searchCondition[1]['bigCategory'] === 'TOPS')}
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[1]['bigCategory'] === 'TOPS') ? '#333333' : 'white' }]}
                                        onPress={this.selectBigCategory.bind(this, 'TOPS')}
                                    />
                                    <Button
                                        icon={
                                            <Image source={require('../../../assets/outer.png')} style={styles.clothImage} />
                                        }
                                        title={this.returnChoiceName('アウター', searchCondition[1]['bigCategory'] === 'OUTER' )}
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[1]['bigCategory'] === 'OUTER') ? '#333333' : 'white' }]}
                                        onPress={this.selectBigCategory.bind(this, 'OUTER')}
                                    />
                                </View>
                            }
                        </View>
                        {/* 色条件 */}
                        <View style={styles.conditionView}>
                            <Button
                                icon={
                                    <Icon name={this.state.colorPulledDown ? "chevron-up" : "chevron-down" } size={Platform.isPad ? 40 : 20} style={{ color: 'grey' }}  />
                                }
                                iconRight={true}
                                title='色で検索'
                                buttonStyle={styles.dropDownButtonStyle}
                                titleStyle={styles.dropDownTitleStyle}
                                onPress={this.toggleColorView}
                            />
                            {!this.state.colorPulledDown ? null :
                                <View>
                                    <Button
                                        icon={
                                            <Icon name='circle' size={20} style={{ color: 'black', marginRight: wp('5%') }}/>
                                        }
                                        title={this.returnChoiceName('ブラック系', searchCondition[0]['color'] === 'BLACK')}
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[0]['color'] === 'BLACK') ? '#333333' : 'white' }]}
                                        onPress={this.selectColor.bind(this, 'BLACK')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={20} style={{ color: 'brown', marginRight: wp('5%') }} />
                                        }
                                        title={this.returnChoiceName('ブラウン系', searchCondition[0]['color'] === 'BROWN')}
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[0]['color'] === 'BROWN') ? '#333333' : 'white' }]}
                                        onPress={this.selectColor.bind(this, 'BROWN')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={20} style={{ color: 'floralwhite', marginRight: wp('5%') }} />
                                        }
                                        title={this.returnChoiceName('ホワイト系', searchCondition[0]['color'] === 'WHITE')}
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[0]['color'] === 'WHITE') ? '#333333' : 'white' }]}
                                        onPress={this.selectColor.bind(this, 'WHITE')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={20} style={{ color: 'blue', marginRight: wp('5%') }} />
                                        }
                                        title={this.returnChoiceName('ブルー系', searchCondition[0]['color'] === 'BLUE')}
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[0]['color'] === 'BLUE') ? '#333333' : 'white' }]}
                                        onPress={this.selectColor.bind(this, 'BLUE')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={20} style={{ color: 'red', marginRight: wp('5%') }} />
                                        }
                                        title={this.returnChoiceName('レッド系', searchCondition[0]['color'] === 'RED')}
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[0]['color'] === 'RED') ? '#333333' : 'white' }]}
                                        onPress={this.selectColor.bind(this, 'RED')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={20} style={{ color: 'green', marginRight: wp('5%') }} />
                                        }
                                        title={this.returnChoiceName('グリーン系', searchCondition[0]['color'] === 'GREEN')}
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[0]['color'] === 'GREEN') ? '#333333' : 'white' }]}
                                        titleStyle={[styles.choiceTitleStyle, { color: !!(searchCondition[0]['color'] === 'GREEN') ? 'white' : 'black' }]}
                                        onPress={this.selectColor.bind(this, 'GREEN')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={20} style={{ color: 'yellow', marginRight: wp('5%') }} />
                                        }
                                        title={this.returnChoiceName('イエロー系', searchCondition[0]['color'] === 'YELLOW')}
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[0]['color'] === 'YELLOW') ? '#333333' : 'white' }]}
                                        titleStyle={[styles.choiceTitleStyle, { color: !!(searchCondition[0]['color'] === 'YELLOW') ? 'white' : 'black' }]}
                                        onPress={this.selectColor.bind(this, 'YELLOW')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={20} style={{ color: 'purple', marginRight: wp('5%') }} />
                                        }
                                        title={this.returnChoiceName('パープル系', searchCondition[0]['color'] === 'PURPLE')}
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[0]['color'] === 'PURPLE') ? '#333333' : 'white' }]}
                                        titleStyle={[styles.choiceTitleStyle, { color: !!(searchCondition[0]['color'] === 'PURPLE') ? 'white' : 'black' }]}
                                        onPress={this.selectColor.bind(this, 'PURPLE')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={20} style={{ color: 'grey', marginRight: wp('5%') }} />
                                        }
                                        title={this.returnChoiceName('グレー系', searchCondition[0]['color'] === 'GRAY')}
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[0]['color'] === 'GRAY') ? '#333333' : 'white' }]}
                                        titleStyle={[styles.choiceTitleStyle, { color: !!(searchCondition[0]['color'] === 'GRAY') ? 'white' : 'black' }]}
                                        onPress={this.selectColor.bind(this, 'GRAY')}
                                    />
                                </View>
                            }
                        </View>
                        {/* サイズ条件 */}
                        <View style={styles.conditionView}>
                            <Button
                                icon={
                                    <Icon name={this.state.sizePulledDown ? "chevron-up" : "chevron-down" } size={Platform.isPad ? 40 : 20} style={{ color: 'grey' }}  />
                                }
                                iconRight={true}
                                title='サイズで検索'
                                buttonStyle={styles.dropDownButtonStyle}
                                titleStyle={styles.dropDownTitleStyle}
                                onPress={this.toggleSizeView}
                            />
                            {!this.state.sizePulledDown ? null :
                                <View>
                                    <Button
                                        icon={
                                            <Icon name='circle' size={12} style={{ color: 'grey', marginRight: wp('5%') }}/>
                                        }
                                        title={this.returnChoiceName('S', searchCondition[2]['size'] === 'S')}
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[2]['size'] === 'S') ? '#333333' : 'white' }]}
                                        onPress={this.selectSize.bind(this, 'S')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={12} style={{ color: 'grey', marginRight: wp('5%') }}/>
                                        }
                                        title={this.returnChoiceName('M', searchCondition[2]['size'] === 'M')}
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[2]['size'] === 'M') ? '#333333' : 'white' }]}
                                        onPress={this.selectSize.bind(this, 'M')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={12} style={{ color: 'grey', marginRight: wp('5%') }}/>
                                        }
                                        title={this.returnChoiceName('L', searchCondition[2]['size'] === 'L')}
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[2]['size'] === 'L') ? '#333333' : 'white' }]}
                                        onPress={this.selectSize.bind(this, 'L')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={12} style={{ color: 'grey', marginRight: wp('5%') }}/>
                                        }
                                        title={this.returnChoiceName('XL', searchCondition[2]['size'] === 'XL')}
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[2]['size'] === 'XL') ? '#333333' : 'white' }]}
                                        onPress={this.selectSize.bind(this, 'XL')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={12} style={{ color: 'grey', marginRight: wp('5%') }}/>
                                        }
                                        title={this.returnChoiceName('XXL', searchCondition[2]['size'] === 'XXL')}
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[2]['size'] === 'XXL') ? '#333333' : 'white' }]}
                                        onPress={this.selectSize.bind(this, 'XXL')}
                                    />
                                </View>
                            }
                        </View>
                        {/* ランク条件 */}
                        <View style={styles.conditionView}>
                            <Button
                                icon={
                                    <Icon name={this.state.rankPulledDown ? "chevron-up" : "chevron-down" } size={Platform.isPad ? 40 : 20} style={{ color: 'grey' }}  />
                                }
                                iconRight={true}
                                title='ランクで検索'
                                buttonStyle={styles.dropDownButtonStyle}
                                titleStyle={styles.dropDownTitleStyle}
                                onPress={this.toggleRankView}
                            />
                            {!this.state.rankPulledDown ? null :
                                <View>
                                    <Button
                                        icon={
                                            <Icon name='circle' size={12} style={{ color: 'grey', marginRight: wp('5%') }}/>
                                        }
                                        title={this.returnChoiceName('Sランク', searchCondition[3]['rank'] === 'S')}
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[3]['rank'] === 'S') ? '#333333' : 'white' }]}
                                        onPress={this.selectRank.bind(this, 'S')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={12} style={{ color: 'grey', marginRight: wp('5%') }}/>
                                        }
                                        title={this.returnChoiceName('Aランク', searchCondition[3]['rank'] === 'A')}
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[3]['rank'] === 'A') ? '#333333' : 'white' }]}
                                        onPress={this.selectRank.bind(this, 'A')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={12} style={{ color: 'grey', marginRight: wp('5%') }}/>
                                        }
                                        title={this.returnChoiceName('Bランク', searchCondition[3]['rank'] === 'B')}
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[3]['rank'] === 'B') ? '#333333' : 'white' }]}
                                        onPress={this.selectRank.bind(this, 'B')}
                                        />
                                </View>
                            }
                        </View>
                    </View>
                    <View style={{ height: hp('15%') }}></View>
                </ScrollView>
                <View style={styles.searchButtonView}>
                    <Button
                        title='検索する →'
                        buttonStyle={styles.searchButtonStyle}
                        titleStyle={styles.searchTitleStyle}
                        onPress={this.searchWithCondition}
                        />
                </View>
            </SafeAreaView>
        );
    }
}


let styles

if(Platform.isPad) {
    styles = StyleSheet.create({
        scrollView: {
            backgroundColor: 'white'
        },
        innerContainer: {
            marginTop: hp('3%')
        },
        conditionView: {
            paddingBottom: hp('2%'),
        },
        dropDownButtonStyle: {
            borderRadius: 40,
            width: wp('40%'),
            marginBottom: hp('1%'),
            marginLeft: wp('10%'),
            backgroundColor: 'white',
            justifyContent: 'flex-start',
            backgroundColor: 'white'
        },
        dropDownTitleStyle: {
            fontSize: 24,
            color: 'black',
            marginRight: wp('3%'),
            fontWeight: '400'
        },
        choiceButtonStyle: {
            borderRadius: 30,
            width: wp('80%'),
            marginLeft: wp('10%'),
            justifyContent: 'flex-start',
        },
        searchButtonView: {
            position: 'absolute',
            right: wp('6%'),
            bottom: hp('4%'),
            shadowColor: 'black',
            shadowOffset: { width: 10, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 60,
        },
        searchButtonStyle: {
            borderRadius: 50,
            width: wp('40%'),
            height: hp('8%'),
            backgroundColor: 'white',
        },
        searchTitleStyle: {
            color: '#7389D9',
            fontSize: 24,
            fontWeight: 'bold'
        },
        choiceView: {
            flexDirection: 'row',
            width: wp('65%')
        },
        choiceText: {
            marginTop: hp('1%'),
            fontSize: 16,
            color: 'white',
            position: 'absolute',
            right: wp('4%')
        },
        choiceContentText: {
            marginTop: hp('1%'),
            fontWeight: '400',
            fontSize: 20,
        },
        choiceImage: {
            color: 'white',
            marginTop: hp('1%'),
            resizeMode: 'contain',
            width: wp("2%"),
            height: wp('2%'),
            position: 'absolute',
            right: wp('1%')
        },
        clothImage: {
            width: wp('3%'),
            height: wp('3%'),
            resizeMode: 'contain',
            marginRight: wp('5%')
        }
    })
} else {
    styles = StyleSheet.create({
        scrollView: {
            backgroundColor: 'white'
        },
        innerContainer: {
            marginTop: hp('3%')
        },
        conditionView: {
            paddingBottom: hp('2%'),
        },
        dropDownButtonStyle: {
            borderRadius: 40,
            width: wp('40%'),
            marginLeft: wp('10%'),
            backgroundColor: 'white',
            justifyContent: 'flex-start',
            backgroundColor: 'white'
        },
        dropDownTitleStyle: {
            fontSize: 14,
            color: 'black',
            marginRight: wp('3%'),
            fontWeight: '400'
        },
        choiceButtonStyle: {
            borderRadius: 30,
            width: wp('80%'),
            marginLeft: wp('10%'),
            justifyContent: 'flex-start',
        },
        searchButtonView: {
            position: 'absolute',
            right: wp('6%'),
            bottom: hp('4%'),
            shadowColor: 'black',
            shadowOffset: { width: 10, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 60,
        },
        searchButtonStyle: {
            borderRadius: 50,
            width: wp('40%'),
            height: hp('8%'),
            backgroundColor: 'white',
        },
        searchTitleStyle: {
            color: '#7389D9',
            fontSize: 16,
            fontWeight: 'bold'
        },
        choiceView: {
            flexDirection: 'row',
            width: wp('65%')
        },
        choiceText: {
            marginTop: hp('1.1%'),
            fontSize: 12,
            fontWeight: '400',
            color: 'white',
            position: 'absolute',
            right: wp('4%')
        },
        choiceContentText: {
            marginTop: hp('1%'),
            fontWeight: '400',
            fontSize: 14,
        },
        choiceImage: {
            color: 'white',
            marginTop: hp('1.1%'),
            resizeMode: 'contain',
            width: wp("3%"),
            height: wp('3%'),
            position: 'absolute',
            right: wp('0%')
        },
        clothImage: {
            width: wp('5%'),
            height: wp('5%'),
            resizeMode: 'contain',
            marginRight: wp('5%')
        }
    })
}

export default SearchConditionModal;