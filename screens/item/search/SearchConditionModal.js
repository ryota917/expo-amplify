import React from 'react';
import { StyleSheet, Text, View, Picker } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { API, graphqlOperation } from 'aws-amplify';
//import * as Query from '../../src/graphql/queries';
import { Button } from 'react-native-elements'
// import FloatingActionButton from 'material-ui/FloatingActionButton'

export default class SearchConditionModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchCondition: [{color: ''}, {size: ''}, {season: ''}]
        }
    }
    static navigationOptions = ({navigation: { navigate }}) => ({
        title: 'さがす',
        headerLeft:() => <Icon name="angle-left" size={28} onPress={()=>{navigate('ItemTab')}} style={{paddingLeft:20}}/>
    });

    searchWithCondition = async () => {
        this.props.navigation.navigate('ItemTab', { searchCondition: this.state.searchCondition })
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff" }}>
                <Picker
                style={{ width: 200, backgroundColor: '#ffffff', marginTop: 20}}
                itemStyle={{ color: 'blue'}}
                selectedValue={this.state.selectedColor}
                onValueChange={(value) => {
                    this.setState({ searchCondition: [{color: value}]});
                }}
                >
                    <Picker.Item lable='全て' value=''/>
                    <Picker.Item label='赤' value='RED'/>
                    <Picker.Item label='青' value='BLUE'/>
                    <Picker.Item label='黒' value='BLACK'/>
                </Picker>

                <Picker
                style={{ width: 200, backgroundColor: '#ffffff', marginTop: 20}}
                itemStyle={{ color: 'blue'}}
                selectedValue={this.state.selectedSeason}
                onValueChange={(value) => {
                    this.setState({ searchCondition: [{season: value}]});
                }}
                >
                    <Picker.Item lable='全て' value=''/>
                    <Picker.Item label='春' value='SPRING'/>
                    <Picker.Item label='夏' value='SUMMER'/>
                </Picker>

                <Picker
                style={{ width: 200, backgroundColor: '#ffffff', marginTop: 20}}
                itemStyle={{ color: 'blue'}}
                selectedValue={this.state.size}
                onValueChange={(value) => {
                    this.setState({ searchCondition: [{size: value}]});
                }}
                >
                    <Picker.Item lable='全て' value=''/>
                    <Picker.Item label='S' value='SMALL'/>
                    <Picker.Item label='M' value='MIDIUM'/>
                    <Picker.Item label='LL' value='LARGE'/>
                </Picker>
                <Button style={styles.button} onPress={this.searchWithCondition} title='検索'/>
                <FloatingActionButton style={styles.floatingButton}>
                    <ContentAdd />
                </FloatingActionButton>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    button:{
        marginTop: 20
    },
    floatingButon: {
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 20,
        left: 'auto',
        position: 'fixed'
    }
})
