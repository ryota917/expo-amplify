import React from 'react';
import { View, Text, Button, Card } from 'react-native';
import send_message from "../src/messaging/slack"

export default class ConfirmPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            items: props.navigation.state.params.items,
            user_name: "test user" // TODO: cognitoから取ってくる．
        };
    }
    confirmAction = () => {
        send_message(this.message_content());
        this.props.navigation.navigate("ItemTab");
    };
    message_content = () =>{
        return `${this.state.user_name}さんから注文がきたで～．\n 注文された商品は${this.state.items.map(item => item.name + "\n")}やで～`//一旦Itemsを出力させる．
    };
    render(){
        // debugger;
        return(
            <View>
                    {this.state.items.map(
                    item => <Text>{item.name}</Text>
                )}
                <Text>{"以上の注文でよろしかったですか"}</Text>

                <Button
                    onPress={this.confirmAction}
                    title="はい"
                />
            </View>
        )
    }

}
