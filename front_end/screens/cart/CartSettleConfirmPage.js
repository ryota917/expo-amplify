import React from 'react'
import { Text, ScrollView, SafeAreaView, View } from 'react-native'
import { Button } from 'react-native-elements'

export class CartSettleConfirmPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return(
            <SafeAreaView>
                <ScrollView>
                    <View>
                        <Text>CartSettleConfirmPage</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}