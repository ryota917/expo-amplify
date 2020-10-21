import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API, graphqlOperation } from 'aws-amplify';
//import * as Query from '../../src/graphql/queries';
import { ListItem, Button } from 'react-native-elements'
import Fab from '@material-ui/core/Fab'
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
            selectedRank: ''
        }
    }
    static navigationOptions = ({navigation: { navigate }}) => ({
        title: 'さがす',
        headerLeft:() => <Icon name="angle-left" size={28} onPress={()=>{navigate('ItemTab')}} style={{paddingLeft:20}}/>
    });

    searchWithCondition = () => {
        const { selectedColor, selectedCategory, selectedSize, selectedRank} = this.state
        this.props.navigation.navigate('ItemTab', { searchCondition: [{color: selectedColor}, {category: selectedCategory}, {size: selectedSize}, {rank: selectedRank}] })
    }

    // color
    toggleColorView = () => {
        this.setState({ colorPulledDown: !this.state.colorPulledDown })
    }

    selectColor = (color) => {
        if(color === this.state.selectedColor) {
            this.setState({ selectedColor: '' })
        } else {
            this.setState({ selectedColor: color })
        }
    }

    // category
    toggleCategoryView = () => {
        this.setState({ categoryPulledDown: !this.state.categoryPulledDown })
    }

    selectCategory = (category) => {
        if(category === this.state.selectedCategory) {
            this.setState({ selectedCategory: ''})
        } else {
            this.setState({ selectedCategory: category })
        }
    }

    //size
    toggleSizeView = () => {
        this.setState({ sizePulledDown: !this.state.sizePulledDown})
    }

    selectSize = (size) => {
        if(size === this.state.selectedSize) {
            this.setState({ selectedSize: ''})
        } else {
            this.setState({ selectedSize: size})
        }
    }

    //rank
    toggleRankView = () => {
        this.setState({ rankPulledDown: !this.state.rankPulledDown})
    }

    selectRank = (rank) => {
        if(rank === this.state.selectedRank) {
            this.setState({ selectedRank: ''})
        } else {
            this.setState({ selectedRank: rank})
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1, backgroundColor: 'white' }} contentContainerStyle={{ paddingBottom: 40}} >
                    {/* 色条件 */}
                    <Button
                        icon={
                            <Icon name={this.state.colorPulledDown ? "chevron-up" : "chevron-down" } size={15} style={{ color: 'grey' }}  />
                        }
                        iconRight={true}
                        title='色で検索'
                        buttonStyle={{ borderRadius: 30, width: wp('30%'), backgroundColor: 'white', marginLeft: wp('10%'), marginTop: hp('1%'), justifyContent: 'flex-start' }}
                        titleStyle={{ fontSize: 10, color: 'black', marginRight: wp('3%') }}
                        onPress={this.toggleColorView}
                    />
                    {!this.state.colorPulledDown ? null :
                        <View>
                            <Button
                                icon={
                                    <Icon name='circle' size={20} style={{ color: 'black', marginRight: wp('5%') }}/>
                                }
                                title='ブラック系'
                                buttonStyle={{ borderRadius: 30, width: wp('80%'), height: hp('4%'), backgroundColor: !!(this.state.selectedColor === 'BLACK') ? '#333333' : 'white', marginLeft: wp('10%'), justifyContent: 'flex-start' }}
                                titleStyle={{ fontSize: 10, color: !!(this.state.selectedColor === 'BLACK') ? 'white' : 'black'}}
                                onPress={this.selectColor.bind(this, 'BLACK')}
                            />
                            <Button
                                icon={
                                    <Icon name='circle' size={20} style={{ color: 'brown', marginRight: wp('5%') }} />
                                }
                                title='ブラウン系'
                                buttonStyle={{ borderRadius: 30, width: wp('80%'), height: hp('4%'), backgroundColor: !!(this.state.selectedColor === 'BROWN') ? '#333333' : 'white', marginLeft: wp('10%'), justifyContent: 'flex-start' }}
                                titleStyle={{ fontSize: 10, color: !!(this.state.selectedColor === 'BROWN') ? 'white' : 'black'}}
                                onPress={this.selectColor.bind(this, 'BROWN')}
                            />
                            <Button
                                icon={
                                    <Icon name='circle' size={20} style={{ color: 'white', marginRight: wp('5%') }} />
                                }
                                title='ホワイト系'
                                buttonStyle={{ borderRadius: 30, width: wp('80%'), backgroundColor: !!(this.state.selectedColor === 'white') ? '#333333' : 'white', marginLeft: wp('10%'), justifyContent: 'flex-start' }}
                                titleStyle={{ fontSize: 10, color: !!(this.state.selectedColor === 'white') ? 'white' : 'black'}}
                                onPress={this.selectColor.bind(this, 'white')}
                            />
                            <Button
                                icon={
                                    <Icon name='circle' size={20} style={{ color: 'blue', marginRight: wp('5%') }} />
                                }
                                title='ブルー系'
                                buttonStyle={{ borderRadius: 30, width: wp('80%'), backgroundColor: !!(this.state.selectedColor === 'BLUE') ? '#333333' : 'white', marginLeft: wp('10%'), justifyContent: 'flex-start' }}
                                titleStyle={{ fontSize: 10, color: !!(this.state.selectedColor === 'BLUE') ? 'white' : 'black'}}
                                onPress={this.selectColor.bind(this, 'BLUE')}
                            />
                            <Button
                                icon={
                                    <Icon name='circle' size={20} style={{ color: 'red', marginRight: wp('5%') }} />
                                }
                                title='レッド系'
                                buttonStyle={{ borderRadius: 30, width: wp('80%'), backgroundColor: !!(this.state.selectedColor === 'RED') ? '#333333' : 'white', marginLeft: wp('10%'), justifyContent: 'flex-start' }}
                                titleStyle={{ fontSize: 10, color: !!(this.state.selectedColor === 'RED') ? 'white' : 'black'}}
                                onPress={this.selectColor.bind(this, 'RED')}
                            />
                            <Button
                                icon={
                                    <Icon name='circle' size={20} style={{ color: 'green', marginRight: wp('5%') }} />
                                }
                                title='グリーン系'
                                buttonStyle={{ borderRadius: 30, width: wp('80%'), backgroundColor: !!(this.state.selectedColor === 'GREEN') ? '#333333' : 'white', marginLeft: wp('10%'), justifyContent: 'flex-start' }}
                                titleStyle={{ fontSize: 10, color: !!(this.state.selectedColor === 'GREEN') ? 'white' : 'black'}}
                                onPress={this.selectColor.bind(this, 'GREEN')}
                            />
                            <Button
                                icon={
                                    <Icon name='circle' size={20} style={{ color: 'yellow', marginRight: wp('5%') }} />
                                }
                                title='イエロー系'
                                buttonStyle={{ borderRadius: 30, width: wp('80%'), backgroundColor: !!(this.state.selectedColor === 'YELLOW') ? '#333333' : 'white', marginLeft: wp('10%'), justifyContent: 'flex-start' }}
                                titleStyle={{ fontSize: 10, color: !!(this.state.selectedColor === 'YELLOW') ? 'white' : 'black'}}
                                onPress={this.selectColor.bind(this, 'YELLOW')}
                            />
                            <Button
                                icon={
                                    <Icon name='circle' size={20} style={{ color: 'purple', marginRight: wp('5%') }} />
                                }
                                title='パープル系'
                                buttonStyle={{ borderRadius: 30, width: wp('80%'), backgroundColor: !!(this.state.selectedColor === 'PURPLE') ? '#333333' : 'white', marginLeft: wp('10%'), justifyContent: 'flex-start' }}
                                titleStyle={{ fontSize: 10, color: !!(this.state.selectedColor === 'PURPLE') ? 'white' : 'black'}}
                                onPress={this.selectColor.bind(this, 'PURPLE')}
                            />
                            <Button
                                icon={
                                    <Icon name='circle' size={20} style={{ color: 'grey', marginRight: wp('5%') }} />
                                }
                                title='グレー系'
                                buttonStyle={{ borderRadius: 30, width: wp('80%'), backgroundColor: !!(this.state.selectedColor === 'GREY') ? '#333333' : 'white', marginLeft: wp('10%'), justifyContent: 'flex-start' }}
                                titleStyle={{ fontSize: 10, color: !!(this.state.selectedColor === 'GREY') ? 'white' : 'black'}}
                                onPress={this.selectColor.bind(this, 'GREY')}
                            />
                        </View>
                    }
                    {/* カテゴリ条件 */}
                    <Button
                        icon={
                            <Icon name={this.state.categoryPulledDown ? "chevron-up" : "chevron-down" } size={15} style={{ color: 'grey' }}  />
                        }
                        iconRight={true}
                        title='カテゴリで検索'
                        buttonStyle={{ borderRadius: 30, width: wp('30%'), backgroundColor: 'white', marginLeft: wp('10%'), marginTop: hp('1%'), justifyContent: 'flex-start' }}
                        titleStyle={{ fontSize: 10, color: 'black', marginRight: wp('3%') }}
                        onPress={this.toggleCategoryView}
                    />
                    {!this.state.categoryPulledDown ? null :
                        <View>
                            <Button
                                // icon={
                                    // <Icon name='circle' size={20} style={{ color: 'black', marginRight: wp('5%'), borderWidth: 1, borderColor: 'white', borderRadius: '50%' }}/>
                                // }
                                title='トップス'
                                buttonStyle={{ borderRadius: 30, width: wp('80%'), backgroundColor: !!(this.state.selectedCategory === 'OUTER') ? '#333333' : 'white', marginLeft: wp('10%'), justifyContent: 'flex-start' }}
                                titleStyle={{ fontSize: 10, color: !!(this.state.selectedCategory === 'OUTER') ? 'white' : 'black'}}
                                onPress={this.selectCategory.bind(this, 'OUTER')}
                            />
                            <Button
                                // icon={
                                    // <Icon name='circle' size={20} style={{ color: 'brown', marginRight: wp('5%') }} />
                                // }
                                title='アウター'
                                buttonStyle={{ borderRadius: 30, width: wp('80%'), height: hp('4%'), backgroundColor: !!(this.state.selectedCategory === 'TOPS') ? '#333333' : 'white', marginLeft: wp('10%'), justifyContent: 'flex-start' }}
                                titleStyle={{ fontSize: 10, color: !!(this.state.selectedCategory === 'TOPS') ? 'white' : 'black'}}
                                onPress={this.selectCategory.bind(this, 'TOPS')}
                            />
                        </View>
                    }
                    {/* サイズ条件 */}
                    <Button
                        icon={
                            <Icon name={this.state.sizePulledDown ? "chevron-up" : "chevron-down" } size={15} style={{ color: 'grey' }}  />
                        }
                        iconRight={true}
                        title='サイズで検索'
                        buttonStyle={{ borderRadius: 30, width: wp('30%'), backgroundColor: 'white', marginLeft: wp('10%'), marginTop: hp('1%'), justifyContent: 'flex-start' }}
                        titleStyle={{ fontSize: 10, color: 'black', marginRight: wp('3%') }}
                        onPress={this.toggleSizeView}
                    />
                    {!this.state.sizePulledDown ? null :
                        <View>
                            <Button
                                // icon={
                                    // <Icon name='circle' size={20} style={{ color: 'black', marginRight: wp('5%'), borderWidth: 1, borderColor: 'white', borderRadius: '50%' }}/>
                                // }
                                title='S'
                                buttonStyle={{ borderRadius: 30, width: wp('80%'), backgroundColor: !!(this.state.selectedSize === 'S') ? '#333333' : 'white', marginLeft: wp('10%'), justifyContent: 'flex-start' }}
                                titleStyle={{ fontSize: 10, color: !!(this.state.selectedSize === 'S') ? 'white' : 'black'}}
                                onPress={this.selectSize.bind(this, 'S')}
                            />
                            <Button
                                // icon={
                                    // <Icon name='circle' size={20} style={{ color: 'brown', marginRight: wp('5%') }} />
                                // }
                                title='M'
                                buttonStyle={{ borderRadius: 30, width: wp('80%'), height: hp('4%'), backgroundColor: !!(this.state.selectedSize === 'M') ? '#333333' : 'white', marginLeft: wp('10%'), justifyContent: 'flex-start' }}
                                titleStyle={{ fontSize: 10, color: !!(this.state.selectedSize === 'M') ? 'white' : 'black'}}
                                onPress={this.selectSize.bind(this, 'M')}
                            />
                            <Button
                                // icon={
                                    // <Icon name='circle' size={20} style={{ color: 'brown', marginRight: wp('5%') }} />
                                // }
                                title='L'
                                buttonStyle={{ borderRadius: 30, width: wp('80%'), height: hp('4%'), backgroundColor: !!(this.state.selectedSize === 'L') ? '#333333' : 'white', marginLeft: wp('10%'), justifyContent: 'flex-start' }}
                                titleStyle={{ fontSize: 10, color: !!(this.state.selectedSize === 'L') ? 'white' : 'black'}}
                                onPress={this.selectSize.bind(this, 'L')}
                            />
                            <Button
                                // icon={
                                    // <Icon name='circle' size={20} style={{ color: 'brown', marginRight: wp('5%') }} />
                                // }
                                title='XL'
                                buttonStyle={{ borderRadius: 30, width: wp('80%'), height: hp('4%'), backgroundColor: !!(this.state.selectedSize === 'XL') ? '#333333' : 'white', marginLeft: wp('10%'), justifyContent: 'flex-start' }}
                                titleStyle={{ fontSize: 10, color: !!(this.state.selectedSize === 'XL') ? 'white' : 'black'}}
                                onPress={this.selectSize.bind(this, 'XL')}
                            />
                            <Button
                                // icon={
                                    // <Icon name='circle' size={20} style={{ color: 'brown', marginRight: wp('5%') }} />
                                // }
                                title='XXL'
                                buttonStyle={{ borderRadius: 30, width: wp('80%'), height: hp('4%'), backgroundColor: !!(this.state.selectedSize === 'XXL') ? '#333333' : 'white', marginLeft: wp('10%'), justifyContent: 'flex-start' }}
                                titleStyle={{ fontSize: 10, color: !!(this.state.selectedSize === 'XXL') ? 'white' : 'black'}}
                                onPress={this.selectSize.bind(this, 'XXL')}
                            />
                        </View>
                    }
                    {/* ランク条件 */}
                    <Button
                        icon={
                            <Icon name={this.state.rankPulledDown ? "chevron-up" : "chevron-down" } size={15} style={{ color: 'grey' }}  />
                        }
                        iconRight={true}
                        title='ランクで検索'
                        buttonStyle={{ borderRadius: 30, width: wp('30%'), backgroundColor: 'white', marginLeft: wp('10%'), marginTop: hp('1%'), justifyContent: 'flex-start' }}
                        titleStyle={{ fontSize: 10, color: 'black', marginRight: wp('3%') }}
                        onPress={this.toggleRankView}
                    />
                    {!this.state.rankPulledDown ? null :
                        <View>
                            <Button
                                // icon={
                                    // <Icon name='circle' size={20} style={{ color: 'black', marginRight: wp('5%'), borderWidth: 1, borderColor: 'white', borderRadius: '50%' }}/>
                                // }
                                title='Sランク'
                                buttonStyle={{ borderRadius: 30, width: wp('80%'), backgroundColor: !!(this.state.selectedRank === 'Sランク') ? '#333333' : 'white', marginLeft: wp('10%'), justifyContent: 'flex-start' }}
                                titleStyle={{ fontSize: 10, color: !!(this.state.selectedRank === 'Sランク') ? 'white' : 'black'}}
                                onPress={this.selectRank.bind(this, 'Sランク')}
                            />
                            <Button
                                // icon={
                                    // <Icon name='circle' size={20} style={{ color: 'brown', marginRight: wp('5%') }} />
                                // }
                                title='Aランク'
                                buttonStyle={{ borderRadius: 30, width: wp('80%'), height: hp('4%'), backgroundColor: !!(this.state.selectedRank === 'Aランク') ? '#333333' : 'white', marginLeft: wp('10%'), justifyContent: 'flex-start' }}
                                titleStyle={{ fontSize: 10, color: !!(this.state.selectedRank === 'Aランク') ? 'white' : 'black'}}
                                onPress={this.selectRank.bind(this, 'Aランク')}
                            />
                            <Button
                                // icon={
                                    // <Icon name='circle' size={20} style={{ color: 'black', marginRight: wp('5%'), borderWidth: 1, borderColor: 'white', borderRadius: '50%' }}/>
                                // }
                                title='Bランク'
                                buttonStyle={{ borderRadius: 30, width: wp('80%'), backgroundColor: !!(this.state.selectedRank === 'Bランク') ? '#333333' : 'white', marginLeft: wp('10%'), justifyContent: 'flex-start' }}
                                titleStyle={{ fontSize: 10, color: !!(this.state.selectedRank === 'Bランク') ? 'white' : 'black'}}
                                onPress={this.selectRank.bind(this, 'Bランク')}
                            />
                        </View>
                    }
                </ScrollView>
                <View style={styles.button}>
                    <Button
                        title='検索する →'
                        buttonStyle={{ borderRadius: 30, width: wp('40%'), height: hp('6%'), backgroundColor: 'white' }}
                        titleStyle={{ color: '#7389D9', fontSize: 16, fontWeight: 'bold' }}
                        onPress={this.searchWithCondition}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        flex: 1,
        position: 'absolute',
        bottom: hp('4%'),
        right: wp('4%'),
        shadowColor: 'black',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        borderRadius: 30,
    }
})

export default SearchConditionModal;