import React from 'react';
import { Platform, View, StyleSheet, Text, Image, SafeAreaView, Button } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import { API, graphqlOperation, Auth } from 'aws-amplify';
import * as gqlQueries from '../src/graphql/queries' // read
import * as gqlMutations from '../src/graphql/mutations'
import { PayjpCardForm } from 'payjp-react-native'
import axios from 'axios'
import { PAYJP } from './common/Payjp'


export default class Credit extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUserEmail: '',
            customerId: ''
        }
    }

    componentDidMount = async () => {
        await this.fetchCurrentUser()
        console.log('componentDidMountがコールされました')
        PayjpCardForm.onCardFormUpdate({
            onCardFormCanceled: () => {
                console.log('PAY.JP card form canceled')
            },
            onCardFormCompleted: () => {
                console.log('PAY.JP card form completed')
            },
            onCardFormProducedToken: token => {
                console.log('PAY.JP token => ', token)
                this.createCustomerByToken(token.id)
                    .then(() => {
                        //トークンの送信に成功したらカードフォームを完了する
                        return PayjpCardForm.completeCardForm()
                    })
                    .catch(e => {
                        console.log(e)
                        console.log(convertMessage(e))
                        return PayjpCardForm.showTokenProcessingError(convertMessage(e))
                    })
            }
        })
    }

    //ログインユーザー情報取得
    fetchCurrentUser = async () => {
        const currentUser = await Auth.currentAuthenticatedUser()
        const currentUserEmail = currentUser.attributes.email
        const userRes = await API.graphql(graphqlOperation(gqlQueries.getUser, { id: currentUserEmail }))
        const customerId = userRes.data.getUser.customerId
        this.setState({
            currentUserEmail: currentUserEmail,
            customerId: customerId
        })
    }

    //TokenをもとにCustomerを作成
    createCustomerByToken = async (tokenId) => {
        console.log('customerを作成します')
        axios.post(
            PAYJP.domain + '/customers',
            // Content-Type application/jsonではなく、application/x-www-form-urlencodedで送信する必要がある。
            qs.stringify({
                email: this.state.currentUserEmail,
                card: tokenId
            }),
            {
                headers: {
                    'Authorization': 'Basic c2tfdGVzdF84Yzc2MzliMWI0Nzk3ZjRmZjQ5NjAzNmE6'
                }
            }
        )
            .then(res => {
                console.log('response creating payjp customer', res)
                const customerId = JSON.parse(res['request']['_response'])['id']
                //customerIdをUserデータに保存
                API.graphql(graphqlOperation(gqlMutations.updateUser, {
                    input: {
                        id: this.state.currentUserEmail,
                        customerId: customerId
                    }
                }))
                this.setState({ customerId: customerId })
            })
            .catch(e => console.log('error creating payjp customer', e))
    }

    //レンタル確定
    //Customerに紐付くSubscriptionを作成、既存でactiveの場合は何もしない
    createSubscription = () => {
        console.log('subscriptionを作成します')
        console.log(this.state.customerId)
        axios.post(
            PAYJP.domain + '/subscriptions',
            qs.stringify({
                customer: this.state.customerId,
                plan: 'plan_standard'
            }),
            {
                headers: {
                    'Authorization': 'Basic c2tfdGVzdF84Yzc2MzliMWI0Nzk3ZjRmZjQ5NjAzNmE6'
                }
            }
        )
            .then(res => console.log('response creating payjp subscription', res))
            .catch(e => console.log('erro creating payjp subscriptions', e))
    }

    componentWillUnmount = () => {
        PayjpCardForm.onCardFormUpdate({
            onCardFormCanceled: () => {
                console.log('PAY.JP card form canceled')
            },
            onCardFormCompleted: () => {
                console.log('PAY.JP card form completed')
            },
            onCardFormProducedToken: token => {
                console.log('PAY.JP token => ', token)
                this.createCustomerByToken(token.id)
                    .then(() => {
                        //トークンの送信に成功したらカードフォームを完了する
                        return PayjpCardForm.completeCardForm()
                    })
                    .catch(e => {
                        console.log(e)
                        console.log(convertMessage(e))
                        return PayjpCardForm.showTokenProcessingError(convertMessage(e))
                    })
            }
        })
    }

    render() {
        return(
            <View>
                {/* 既存の場合は登録中のカードを表示 */}
                <Button
                    title='カードを登録する'
                    onPress={() => PayjpCardForm.startCardForm()}
                />
                <Button
                    title='レンタルを確定する'
                    onPress={() => this.createSubscription()}
                />
                <Button
                    title='サブスクリプションを削除する'
                    onPress={() => console.log('削除')}
                />
                <Button
                    title='カードを追加する'
                    onPress={() => console.log('追加する')}
                />
                {/* どのカードで決済するか選択するチェックボックス的なもの */}
            </View>
        )
    }
}
