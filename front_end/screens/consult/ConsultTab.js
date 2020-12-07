import React from 'react';
import { Platform, StyleSheet, Image, SafeAreaView, View, Text, TextInput } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {
    GiftedChat,
    Send,
    Composer,
    Message,
    MessageText,
    Bubble,
    Avatar,
    Day
} from 'react-native-gifted-chat'
import { API, graphqlOperation, Auth } from 'aws-amplify';
import * as gqlQueries from '../../../src/graphql/queries' // read
import * as gqlMutations from '../../../src/graphql/mutations'
import send_message from '../../../src/messaging/slack'
import DoubleButtonImageModal from '../common/DoubleButtonImageModal'

const initialMessage = {
    _id: 'support',
    text: "わからないことや、ご相談はこちらからお気軽にお尋ねください。",
    user: {
        _id: 'support',
        avatar: require('../../../assets/pretapo-icon.png')
    },
}

export class ConsultTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUserEmail: '',
            messages: []
        }
    }

    static navigationOptions = ({navigation}) => ({
        headerTitle: () => (
            <Image source={require('../../../assets/pretapo-logo-header.png')} style={styles.logoImage}/>
        ),
        headerLeft: () => <FontAwesomeIcon name="bars" size={Platform.isPad ? 40 : 28} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft:20}}/>,
        headerStyle: {
            height: hp('7%')
        }
    });

    componentDidMount = async () => {
        await this.fetchCurrentUser()
        this.fetchMessage()
        this.props.navigation.addListener('didFocus', async () => {
            await this.showModalToLogin()
            this.fetchMessage()
        })
    }

    //ログインユーザー情報取得
    fetchCurrentUser = async () => {
        try {
            const currentUser = await Auth.currentAuthenticatedUser()
            const currentUserEmail = currentUser.attributes.email
            this.setState({ currentUserEmail: currentUserEmail })
        } catch(err) {
            this.setState({ isNotLoginModalVisible: true })
        }
    }

    //ログイン促進モーダル表示判定
    showModalToLogin = () => {
        if(!this.state.currentUserEmail) {
            this.setState({ isNotLoginModalVisible: true })
        }
    }

    onPressNotLoginedModalLeftButton = () => {
        this.props.navigation.state.params.onStateChangeSignup()
    }

    onPressNotLoginedModalRightButton = () => {
        this.setState({ isNotLoginModalVisible: false })
        this.props.navigation.navigate('ItemTab')
    }

    //メッセージデータ取得
    fetchMessage = async () => {
        //ログインしていない場合は処理を終了
        if(!this.state.currentUserEmail) return
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
        messageRes.data.searchMessages.items.map(obj => {
            obj['_id'] = obj['id']
            obj['user'] = {
                '_id': obj['user'][0],
                'avatar': require('../../../assets/pretapo-icon.png')
            }
            messages.push(obj)
        })
        this.setState({ messages: GiftedChat.append([initialMessage], messages) })
    }

    onSend = (messages = []) => {
        const { currentUserEmail } = this.state
        // const slackMessage = currentUserEmail + 'からご相談が来たよ\。\nadminから返信してね\n' + messages[0]['text']
        // send_message(slackMessage)
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

    renderComposer = props => {
        return(
            <Composer
                {...props}
                textInputStyle={styles.renderComposerStyle}
                placeholder='メッセージを入力してください。'
            />
        )
    }

    renderSend = props => {
        return(
            <Send {...props}>
                <Image source={require('pretapo/assets/send.png')} style={styles.renderSendStyle} />
            </Send>
        )
    }

    renderBubble = props => {
        return(
            <Bubble
                {...props}
                textStyle={{
                    left: {
                        color: '#7389D9',
                        padding: 8
                    },
                    right: {
                        color: 'white',
                        padding: 8
                    }
                }}
                wrapperStyle={{
                    left: {
                        backgroundColor: 'white',
                        borderBottomRightRadius: 28,
                        borderBottomLeftRadius: 28,
                        borderTopRightRadius: 28,
                        borderTopLeftRadius: 28,
                        marginTop: 5,
                    },
                    right: {
                        backgroundColor: '#7389D9',
                        borderBottomRightRadius: 28,
                        borderBottomLeftRadius: 28,
                        borderTopRightRadius: 28,
                        borderTopLeftRadius: 28,
                        marginTop: 5,
                    }
                }}
            />
        )
    }

    renderChatFooter = () => {
        return(
            <View style={{ height: 10 }}>
            </View>
        )
    }

    renderDay = props => {
        console.log('renderDayprops', props)
        return(
            <Day
                {...props}
                dateFormat='YYYY.M.D'
            />
        )
    }

    //quickRepliesでアンケート取れる
    render() {
        const {
            messages,
            currentUserEmail,
            isNotLoginModalVisible
        } = this.state
        return(
            <SafeAreaView style={{ flex: 1 }}>
                <DoubleButtonImageModal
                    isModalVisible={isNotLoginModalVisible}
                    onPressLeftButton={() => this.onPressNotLoginedModalLeftButton()}
                    onPressRightButton={() => this.onPressNotLoginedModalRightButton()}
                    bigText={'この画面の表示には\nログインが必要です。'}
                    smallText={'気になる服を保存するために登録してみませんか。\nユーザー登録は無料で行えます。\n※レンタル確定には有料のレンタルプランが必要です。'}
                    leftButtonText='ユーザー登録する'
                    rightButtonText='アイテム一覧へ戻る'
                    image={require('../../../assets/thankYouTaggu.png')}
                />
                <GiftedChat
                    renderSend={props => this.renderSend(props)}
                    renderComposer={props => this.renderComposer(props)}
                    renderChatFooter={() => this.renderChatFooter()}
                    renderDay={props => this.renderDay(props)}
                    renderBubble={props => this.renderBubble(props)}
                    renderTime={() => null}
                    alwaysShowSend={true}
                    messages={messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: currentUserEmail
                    }}
                />
            </SafeAreaView>
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
        },
        renderSendStyle: {
            width: 30,
            height: 30,
            marginBottom: 7,
            marginRight: 20
        },
        renderComposerStyle: {
            marginBottom: 5,
            marginTop: 15,
            marginLeft: 15,
            marginRight: 15
        }
    })
}