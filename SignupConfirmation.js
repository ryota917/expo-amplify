import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { Auth } from 'aws-amplify';
import { Input, Button } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

export default class Signin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }

    render() {
        if(this.props.authState !== '') {
            return null;
        } else {
            return(
                <View>
                    <Text></Text>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
})