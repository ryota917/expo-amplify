import React from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
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
        headerLeft:() => <Icon name="angle-left" size={28} onPress={()=>{navigate('ItemTab')}} style={{paddingLeft:20}}/>
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

    render() {
        const { searchCondition } = this.state
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scrollView} >
                    <View style={styles.innerContainer}>
                        {/* カテゴリ条件 */}
                        <View style={styles.conditionView}>
                            <Button
                                icon={
                                    <Icon name={this.state.categoryPulledDown ? "chevron-up" : "chevron-down" } size={14} style={{ color: 'grey' }}  />
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
                                            <Image source={require('../../../assets/tops.png')} style={{ width: wp('5%'), height: wp('5%'), resizeMode: 'contain', marginRight: wp('5%') }} />
                                        }
                                        title='トップス'
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[1]['bigCategory'] === 'TOPS') ? '#333333' : 'white' }]}
                                        titleStyle={[styles.choiceTitleStyle, { color: !!(searchCondition[1]['bigCategory'] === 'TOPS') ? 'white' : 'black' }]}
                                        onPress={this.selectBigCategory.bind(this, 'TOPS')}
                                    />
                                    <Button
                                        icon={
                                            <Image source={require('../../../assets/outer.png')} style={{ width: wp('5%'), height: wp('5%'), resizeMode: 'contain', marginRight: wp('5%') }} />
                                        }
                                        title='アウター'
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[1]['bigCategory'] === 'OUTER') ? '#333333' : 'white' }]}
                                        titleStyle={[styles.choiceTitleStyle, { color: !!(searchCondition[1]['bigCategory'] === 'OUTER') ? 'white' : 'black' }]}
                                        onPress={this.selectBigCategory.bind(this, 'OUTER')}
                                    />
                                </View>
                            }
                        </View>
                        {/* 色条件 */}
                        <View style={styles.conditionView}>
                            <Button
                                icon={
                                    <Icon name={this.state.colorPulledDown ? "chevron-up" : "chevron-down" } size={14} style={{ color: 'grey' }}  />
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
                                        title='ブラック系'
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[0]['color'] === 'BLACK') ? '#333333' : 'white' }]}
                                        titleStyle={[styles.choiceTitleStyle, { color: !!(searchCondition[0]['color'] === 'BLACK') ? 'white' : 'black' }]}
                                        onPress={this.selectColor.bind(this, 'BLACK')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={20} style={{ color: 'brown', marginRight: wp('5%') }} />
                                        }
                                        title='ブラウン系'
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[0]['color'] === 'BROWN') ? '#333333' : 'white' }]}
                                        titleStyle={[styles.choiceTitleStyle, { color: !!(searchCondition[0]['color'] === 'BROWN') ? 'white' : 'black' }]}
                                        onPress={this.selectColor.bind(this, 'BROWN')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={20} style={{ color: 'floralwhite', marginRight: wp('5%') }} />
                                        }
                                        title='ホワイト系'
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[0]['color'] === 'white') ? '#333333' : 'white' }]}
                                        titleStyle={[styles.choiceTitleStyle, { color: !!(searchCondition[0]['color'] === 'white') ? 'white' : 'black' }]}
                                        onPress={this.selectColor.bind(this, 'white')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={20} style={{ color: 'blue', marginRight: wp('5%') }} />
                                        }
                                        title='ブルー系'
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[0]['color'] === 'BLUE') ? '#333333' : 'white' }]}
                                        titleStyle={[styles.choiceTitleStyle, { color: !!(searchCondition[0]['color'] === 'BLUE') ? 'white' : 'black' }]}
                                        onPress={this.selectColor.bind(this, 'BLUE')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={20} style={{ color: 'red', marginRight: wp('5%') }} />
                                        }
                                        title='レッド系'
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[0]['color'] === 'RED') ? '#333333' : 'white' }]}
                                        titleStyle={[styles.choiceTitleStyle, { color: !!(searchCondition[0]['color'] === 'RED') ? 'white' : 'black' }]}
                                        onPress={this.selectColor.bind(this, 'RED')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={20} style={{ color: 'green', marginRight: wp('5%') }} />
                                        }
                                        title='グリーン系'
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[0]['color'] === 'GREEN') ? '#333333' : 'white' }]}
                                        titleStyle={[styles.choiceTitleStyle, { color: !!(searchCondition[0]['color'] === 'GREEN') ? 'white' : 'black' }]}
                                        onPress={this.selectColor.bind(this, 'GREEN')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={20} style={{ color: 'yellow', marginRight: wp('5%') }} />
                                        }
                                        title='イエロー系'
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[0]['color'] === 'YELLOW') ? '#333333' : 'white' }]}
                                        titleStyle={[styles.choiceTitleStyle, { color: !!(searchCondition[0]['color'] === 'YELLOW') ? 'white' : 'black' }]}
                                        onPress={this.selectColor.bind(this, 'YELLOW')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={20} style={{ color: 'purple', marginRight: wp('5%') }} />
                                        }
                                        title='パープル系'
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[0]['color'] === 'PURPLE') ? '#333333' : 'white' }]}
                                        titleStyle={[styles.choiceTitleStyle, { color: !!(searchCondition[0]['color'] === 'PURPLE') ? 'white' : 'black' }]}
                                        onPress={this.selectColor.bind(this, 'PURPLE')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={20} style={{ color: 'grey', marginRight: wp('5%') }} />
                                        }
                                        title='グレー系'
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[0]['color'] === 'GREY') ? '#333333' : 'white' }]}
                                        titleStyle={[styles.choiceTitleStyle, { color: !!(searchCondition[0]['color'] === 'GREY') ? 'white' : 'black' }]}
                                        onPress={this.selectColor.bind(this, 'GREY')}
                                    />
                                </View>
                            }
                        </View>
                        {/* サイズ条件 */}
                        <View style={styles.conditionView}>
                            <Button
                                icon={
                                    <Icon name={this.state.sizePulledDown ? "chevron-up" : "chevron-down" } size={14} style={{ color: 'grey' }}  />
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
                                        title='S'
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[2]['size'] === 'S') ? '#333333' : 'white' }]}
                                        titleStyle={[styles.choiceTitleStyle, { color: !!(searchCondition[2]['size'] === 'S') ? 'white' : 'black' }]}
                                        onPress={this.selectSize.bind(this, 'S')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={12} style={{ color: 'grey', marginRight: wp('5%') }}/>
                                        }
                                        title='M'
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[2]['size'] === 'M') ? '#333333' : 'white' }]}
                                        titleStyle={[styles.choiceTitleStyle, { color: !!(searchCondition[2]['size'] === 'M') ? 'white' : 'black' }]}
                                        onPress={this.selectSize.bind(this, 'M')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={12} style={{ color: 'grey', marginRight: wp('5%') }}/>
                                        }
                                        title='L'
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[2]['size'] === 'L') ? '#333333' : 'white' }]}
                                        titleStyle={styles.choiceTitleStyle, { color: !!(searchCondition[2]['size'] === 'L') ? 'white' : 'black' }}
                                        onPress={this.selectSize.bind(this, 'L')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={12} style={{ color: 'grey', marginRight: wp('5%') }}/>
                                        }
                                        title='XL'
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[2]['size'] === 'XL') ? '#333333' : 'white' }]}
                                        titleStyle={[styles.choiceTitleStyle, { color: !!(searchCondition[2]['size'] === 'XL') ? 'white' : 'black' }]}
                                        onPress={this.selectSize.bind(this, 'XL')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={12} style={{ color: 'grey', marginRight: wp('5%') }}/>
                                        }
                                        title='XXL'
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[2]['size'] === 'XXL') ? '#333333' : 'white' }]}
                                        titleStyle={[styles.choiceTitleStyle, { color: !!(searchCondition[2]['size'] === 'XXL') ? 'white' : 'black' }]}
                                        onPress={this.selectSize.bind(this, 'XXL')}
                                    />
                                </View>
                            }
                        </View>
                        {/* ランク条件 */}
                        <View style={styles.conditionView}>
                            <Button
                                icon={
                                    <Icon name={this.state.rankPulledDown ? "chevron-up" : "chevron-down" } size={14} style={{ color: 'grey' }}  />
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
                                        title='Sランク'
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[3]['rank'] === 'S') ? '#333333' : 'white' }]}
                                        titleStyle={[styles.choiceTitleStyle, { color: !!(searchCondition[3]['rank'] === 'S') ? 'white' : 'black' }]}
                                        onPress={this.selectRank.bind(this, 'S')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={12} style={{ color: 'grey', marginRight: wp('5%') }}/>
                                        }
                                        title='Aランク'
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[3]['rank'] === 'A') ? '#333333' : 'white' }]}
                                        titleStyle={[styles.choiceTitleStyle, { color: !!(searchCondition[3]['rank'] === 'A') ? 'white' : 'black' }]}
                                        onPress={this.selectRank.bind(this, 'A')}
                                    />
                                    <Button
                                        icon={
                                            <Icon name='circle' size={12} style={{ color: 'grey', marginRight: wp('5%') }}/>
                                        }
                                        title='Bランク'
                                        buttonStyle={[styles.choiceButtonStyle, { backgroundColor: !!(searchCondition[3]['rank'] === 'B') ? '#333333' : 'white' }]}
                                        titleStyle={[styles.choiceTitleStyle, { color: !!(searchCondition[3]['rank'] === 'B') ? 'white' : 'black' }]}
                                        onPress={this.selectRank.bind(this, 'B')}
                                    />
                                </View>
                            }
                        </View>
                    </View>
                    <View style={{ height: hp('25%') }}></View>
                </ScrollView>
                <View style={styles.searchButtonView}>
                    <Button
                        title='検索する →'
                        buttonStyle={styles.searchButtonStyle}
                        titleStyle={styles.searchTitleStyle}
                        onPress={this.searchWithCondition}
                        />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: wp('100%'),
        height: hp('100%'),
        backgroundColor: 'white'
    },
    scrollView: {
    },
    innerContainer: {
        marginTop: hp('3%')
    },
    conditionView: {
        paddingBottom: hp('2%'),
    },
    dropDownButtonStyle: {
        borderRadius: 30,
        width: wp('40%'),
        marginLeft: wp('10%'),
        marginBottom: hp('1%'),
        backgroundColor: 'white',
        justifyContent: 'flex-start',
        backgroundColor: 'white'
    },
    dropDownTitleStyle: {
        fontSize: 13,
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
    choiceTitleStyle: {
        fontSize: 13,
        fontWeight: '400'
    },
    searchButtonView: {
        position: 'absolute',
        right: wp('10%'),
        bottom: hp('20%'),
        backgroundColor: 'transparent',
        shadowColor: 'black',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 20
    },
    searchButtonStyle: {
        borderRadius: 30,
        width: wp('40%'),
        height: hp('6%'),
        backgroundColor: 'white',
    },
    searchTitleStyle: {
        color: '#7389D9',
        fontSize: 16,
        fontWeight: 'bold'
    }
})

export default SearchConditionModal;