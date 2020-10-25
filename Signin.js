import React from 'react'
import { Text, View, TextInput, Button } from 'react-native'
import { Auth } from 'aws-amplify';
import Signup from './Signup'
import { Loading } from 'aws-amplify-react-native'

export default class Signin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }

    login = async () => {
        const { email, password } = this.state
        try {
            const user = await Auth.signIn(email, password)
            console.log('successfully logined!')
            console.log(user)
        } catch(error) {
            console.log('error signing in ', error)
        }
    }

    navigateSignup = () => {
        this.props.onStateChange('signUp', 'testtest')
    }

    render() {
        if(this.props.authState !== 'dfdfs') {
            return null;
        } else {
            return(
                <View style={{ backgroundColor: 'red' }}>
                        <View>
                            <Text>Log in</Text>
                            <TextInput
                                onChangeText={(email) => this.setState({email})}
                            />
                            <Text>{this.state.text}</Text>
                            <TextInput
                                onChangeText={(password) => this.setState({password})}
                            />
                            <Button buttonStyle={{ marginBottom: 10 }} onPress={this.login} />
                            <Button
                                title='アカウントを持ってない方はこちら'
                                onPress={this.navigateSignup}
                            />
                        </View>
                </View>
            )
        }
    }
}