import React from 'react'
import { View, Text, SafeAreaView, ScrollView, Button } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Icon from 'react-native-vector-icons/FontAwesome'
import { API, graphqlOperation, Auth } from 'aws-amplify';
import * as gqlQueries from 'pretapo/src/graphql/queries' // read
import * as gqlMutations from 'pretapo/src/graphql/mutations'
import { PayjpCardForm } from 'payjp-react-native'
import { PAYJP, payjpAxios } from 'pretapo/front_end/screens/common/Payjp'
import qs from 'qs'

export class SettleEditPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUserEmail: '',
            customerId: '',
            subscriptionId: '',
            cards: [],
            defaultCard: {}
        }
    }

    static navigationOptions = ({navigation}) => ({
        title: '決済情報の編集',
        headerLeft: () => <Icon name="bars" size={28} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft:20}}/>,
        headerStyle: {
            height: hp('7%')
        }
    });

    componentDidMount = async () => {
        try {
            console.log('componentDidMountがコールされました')
            await this.fetchCurrentUser()
            this.fetchPayjpData()
            this.payjpCardUpdate()
        } catch(e) {
            console.error('error while componentDidMount call:', e)
        }
    }

    //クリーンアップ
    componentWillUnmount = () => {
        this.payjpCardUpdate()
    }


    //payjpのカード情報アップデート時
    payjpCardUpdate = () => {
        const { customerId } = this.state
        PayjpCardForm.onCardFormUpdate({
            onCardFormCanceled: () => {
                console.log('PAY.JP card form canceled')
            },
            onCardFormCompleted: () => {
                console.log('PAY.JP card form completed')
            },
            onCardFormProducedToken: async (token) => {
                console.log('PAY.JP token => ', token)
                //既にCustomerが作成されている場合はカード追加、Customer未作成の場合はCardに紐付くCustomerを作成
                if(customerId) {
                    await this.addCardToCustomer(token.id)
                } else {
                    await this.createCustomerByToken(token.id)
                }
                return PayjpCardForm.completeCardForm()

            }
        })
    }

    //customerIdを元にPayjpからデータ取得
    fetchPayjpData = () => {
        const { customerId } = this.state
        if(!customerId) return
        console.log('Customerデータを取得します', customerId)
        payjpAxios.get('/customers/' + customerId)
            .then(res => {
                console.log('customerデータを取得しました', res)
                const resObj = JSON.parse(res['request']['_response'])
                const subscriptionId = resObj.subscriptions?.data[0]?.id
                let cards = []
                resObj.cards.data.map(card => cards.push(card))
                console.log('登録ずみカード情報です', cards)
                this.setState({
                    subscriptionId: subscriptionId,
                    cards: cards
                })
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
            customerId: customerId,
        })
    }

    //初回カード登録時
    //TokenをもとにCardが紐づくCustomerを作成
    createCustomerByToken = async (tokenId) => {
        console.log('customerを作成します')
        payjpAxios.post(
            'customers',
            qs.stringify({
                email: this.state.currentUserEmail,
                card: tokenId
            })
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

    //カード追加時
    addCardToCustomer = (tokenId) => {
        console.log('既存のCustomerにカード情報を追加します')
        const { customerId } = this.state
        payjpAxios.post(
            'customers/' + customerId  + '/cards',
            qs.stringify({
                card: tokenId
            })
        )
            .then(res => console.log('カード情報を追加しました', res))
            .catch(e => console.error('カード情報の追加に失敗しました', e))
    }


    //決済に用いるカード変更
    changeSettleCard = (cardId) => {
        console.log('デフォルトカードを変更します')
        const { customerId } = this.state
        payjpAxios.post(
            'customers/' + customerId,
            qs.stringify({
                default_card: cardId
            })
        )
            .then(res => console.log('デフォルトカードを更新しました' + res))
            .catch(e => console.error('デフォルトカードの更新に失敗しました' + e))
    }

    //カードを削除
    deleteCustomerCard = (cardId) => {
        console.log('カードを削除します')
        const { customerId } = this.state
        payjpAxios.delete(
            'customers/' + customerId + '/cards/' + cardId
        )
        console.log('カードを削除しました')
    }

    //サブスクリプション作成(レンタル確定?)
    //Customerに紐付くSubscriptionがない場合作成、既存でactiveの場合は何もしない、activeでない場合はアクティベート
    createSubscription = () => {
        console.log('subscriptionを作成します')
        payjpAxios.post(
            'subscriptions',
            qs.stringify({
                customer: this.state.customerId,
                plan: 'plan_standard'
            })
        )
            .then(res => console.log('response creating payjp subscription', res))
            .catch(e => console.log('erro creating payjp subscriptions', e))
    }

    //サブスクリプションを停止は引き落とし時にエラーが発生した時の処理にかぶるので、手動で終了したい時はキャンセルにする
    cancelSubscription = () => {
        console.log('サブスクリプションを停止します')
        const { subscriptionId } = this.state
        payjpAxios.post('subscriptions/' + subscriptionId + '/cancel')
            .then(res => console.log('サブスクリプションをキャンセルしました', res))
    }

    //Customerに単発支払いを作成
    //Customerが既存の場合は、既存のものにCharge、未作成の場合はCustomerを作成してChargeを紐づける
    createCharge = () => {
        console.log('Chargeを作成します')
    }

    render() {
        const { cards } = this.state
        return(
            <View>
                {/* 既存の場合は登録中のカードを表示 */}
                <Button
                    title='カードを登録する'
                    onPress={() => PayjpCardForm.startCardForm()}
                />
                <Button
                    title='カードを追加する'
                    onPress={() => PayjpCardForm.startCardForm()}
                />
                <Button
                    title='レンタルを確定する'
                    onPress={() => this.createSubscription()}
                />
                <Button
                    title='サブスクリプションをキャンセルする'
                    onPress={() => this.cancelSubscription()}
                />
                {cards.map((card, idx) =>
                    <View key={idx}>
                        <Button
                            title={card.brand}
                            onPress={() => this.changeSettleCard(card.id)}
                        />
                        <Button
                            title='削除'
                            onPress={() => this.deleteCustomerCard(card.id)}
                        />
                    </View>
                )}
                {/* customerIdが存在する時 */}
                {/* どのカードで決済するか選択するチェックボックス的なもの */}
                {/* 新規カード追加 */}
                {/* customerIdが存在しない時 */}
                {/* カードを登録する */}
            </View>
        )
    }
}
