import React from 'react';
import { StyleSheet, Text, View, Picker } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API, graphqlOperation } from 'aws-amplify';
//import * as Query from '../../src/graphql/queries';
import { COLOR } from './Color';
import { Button } from 'react-native-elements'

export default class SearchConditionModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedColor: 'ALL',
            selectedSize: 'ALL',
            selectedSeason: 'ALL'
        }
    }
    static navigationOptions = ({navigation: { navigate }}) => ({
        title: '条件検索画面',
        headerLeft:() => <Icon name="angle-left" size={28} onPress={()=>{navigate('ItemTab')}} style={{paddingLeft:20}}/>
    });

    searchWithCondition = async () => {
        console.log(this.state)
        this.props.navigation.navigate('ItemTab', { searchCondition: this.state })
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff" }}>
                <Picker
                style={{ width: 200, backgroundColor: '#ffffff', marginTop: 20}}
                itemStyle={{ color: 'blue'}}
                selectedValue={this.state.selectedColor}
                onValueChange={(value) => {
                    this.setState({ selectedColor: value});
                }}
                >
                    <Picker.Item lable='全て' value='ALL'/>
                    <Picker.Item label='赤' value='RED'/>
                    <Picker.Item label='青' value='BLUE'/>
                    <Picker.Item label='黒' value='BLACK'/>
                </Picker>

                <Picker
                style={{ width: 200, backgroundColor: '#ffffff', marginTop: 20}}
                itemStyle={{ color: 'blue'}}
                selectedValue={this.state.selectedSeason}
                onValueChange={(value) => {
                    this.setState({ selectedSeason: value});
                }}
                >
                    <Picker.Item lable='全て' value='ALL'/>
                    <Picker.Item label='春' value='SPRING'/>
                    <Picker.Item label='夏' value='SUMMER'/>
                </Picker>

                <Picker
                style={{ width: 200, backgroundColor: '#ffffff', marginTop: 20}}
                itemStyle={{ color: 'blue'}}
                selectedValue={this.state.selectedSize}
                onValueChange={(value) => {
                    this.setState({ selectedSize: value});
                }}
                >
                    <Picker.Item lable='全て' value='ALL'/>
                    <Picker.Item label='S' value='SMALL'/>
                    <Picker.Item label='M' value='MIDIUM'/>
                    <Picker.Item label='LL' value='LARGE'/>
                </Picker>
                <Button style={styles.button} onPress={this.searchWithCondition} title='検索'/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    button:{
        marginTop: 20
    }
})