import React from 'react';
import { Platform, View, StyleSheet, Text, Image, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import { GiftedChat } from 'react-native-gifted-chat'
import { API, graphqlOperation, Auth } from 'aws-amplify';
import * as gqlQueries from '../src/graphql/queries' // read
import * as gqlMutations from '../src/graphql/mutations'
import * as gqlSubscriptions from '../src/graphql/subscriptions'
import send_message from '../src/messaging/slack'

class ConsultTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemCart: [],
            cartSize: 0
        }
    }

    static navigationOptions = ({navigation}) => ({
        headerTitle: () => (
            <Image source={require('../assets/pretapo-logo-header.png')} style={styles.logoImage}/>
        ),
        headerLeft: () => <Icon name="bars" size={Platform.isPad ? 40 : 28} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft:20}}/>,
        headerStyle: {
            height: hp('7%')
        }
    });

    componentDidMount() {
    }

    render() {
        return(
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={styles.innerContainer}>
                        <Image source={require('../assets/consult-taggu.png')} style={styles.tagguImage} />
                        <Text style={styles.mainText}>{"お問い合わせ・ご相談は\nLINE@で対応致します。"}</Text>
                        <Image source={require('../assets/line.png')} style={styles.lineImage} />
                        <Text style={styles.subText}>{"こちらのアカウントのトークルームにて、\n登録した氏名・メールアドレスを記載の上\nメッセージを送信してください"}</Text>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

const initialMessage = {
    _id: 0,
    text: "わからないことがあったら聞いてね",
    user: {
        _id: 'support',
        avatar: require('../assets/pretapo-icon.png')
    },
}

export default class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUserEmail: '',
            messages: []
        }
    }

    componentDidMount = async () => {
        await this.fetchCurrentUser()
        this.fetchMessage()
        this.props.navigation.addListener('didFocus', async () => {
            await this.fetchCurrentUser()
            this.fetchMessage()
        })
    }

    fetchCurrentUser = async () => {
        const currentUser = await Auth.currentAuthenticatedUser()
        const currentUserEmail = currentUser.attributes.email
        this.setState({ currentUserEmail: currentUserEmail })
    }

    fetchMessage = async () => {
        const { currentUserEmail } = this.state
        const messageRes = await API.graphql(graphqlOperation(gqlQueries.searchMessages, {
            filter: {
                room: {
                    eq: currentUserEmail
                }
            },
            sort: {
                field: 'createdAt',
                direction: 'desc'
            }
        }))
        let messages = []
        //メッセージを整形
        messageRes.data.searchMessages.items.forEach(obj => {
            obj['_id'] = obj['id']
            obj['user'] = { '_id': obj['user'][0] }
            messages.push(obj)
        })
        console.log('messagesです')
        console.log(messages)
        this.setState({ messages: GiftedChat.append([initialMessage], messages) })
    }

    onSend = (messages = []) => {
        const { currentUserEmail } = this.state
        const slackMessage = currentUserEmail + 'からご相談が来たよ\。\nadminから返信してね\n' + messages[0]['text']
        send_message(slackMessage)
        this.setState(prevState => ({
            messages: GiftedChat.append(prevState.messages, messages)
        }))
        API.graphql(graphqlOperation(gqlMutations.createMessage, {
            input: {
                id: messages[0]['_id'],
                text: messages[0]['text'],
                room: currentUserEmail,
                user: [currentUserEmail]
            }
        }))
    }

    //quickRepliesでアンケート取れる
    render() {
        const { messages, currentUserEmail } = this.state
        return(
            <GiftedChat
                showUserAvatar={false}
                alwaysShowSend={true}
                messages={messages}
                onSend={messages => this.onSend(messages)}
                placeholder='メッセージを入力してください'
                user={{
                    _id: currentUserEmail
                }}
            />
        )
    }
}


let styles

if(Platform.isPad) {
    styles = StyleSheet.create({
        logoImage :{
            resizeMode: 'contain',
            width: wp('20%'),
            height: hp('8%')
        },
        container: {
            width: wp('100%'),
            height: hp('100%')
        },
        innerContainer: {
            width: wp('80%'),
            left: wp('10%')
        },
        tagguImage: {
            width: wp('80%'),
            height: hp('40%'),
            resizeMode: 'contain'
        },
        lineImage: {
            width: wp('80%'),
            height: hp('10%'),
            resizeMode: 'contain',
            marginTop: hp('3%')
        },
        mainText: {
            textAlign: 'center',
            fontSize: 17,
            marginTop: -hp('5%')
        },
        subText: {
            textAlign: 'center',
            marginTop: hp('3%')
        }
    })
} else {
    styles = StyleSheet.create({
        logoImage: {
            resizeMode: 'contain',
            width: wp('23%'),
            height: hp('10%')
        },
        container: {
            width: wp('100%'),
            height: hp('100%')
        },
        innerContainer: {
            width: wp('80%'),
            left: wp('10%')
        },
        tagguImage: {
            width: wp('80%'),
            height: hp('40%'),
            resizeMode: 'contain'
        },
        lineImage: {
            width: wp('80%'),
            height: hp('10%'),
            resizeMode: 'contain',
            marginTop: hp('3%')
        },
        mainText: {
            textAlign: 'center',
            fontSize: 17,
            marginTop: -hp('5%')
        },
        subText: {
            textAlign: 'center',
            marginTop: hp('3%')
        }
    })
}


