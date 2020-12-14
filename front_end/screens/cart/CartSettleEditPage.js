import React from 'react'
import { View, Text, SafeAreaView, ScrollView, StyleSheet, TextInput } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import { Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import { API, graphqlOperation, Auth } from 'aws-amplify';
import * as gqlQueries from 'pretapo/src/graphql/queries' // read
import * as gqlMutations from 'pretapo/src/graphql/mutations'
import { PayjpCardForm } from 'payjp-react-native'
import { PAYJP, payjpAxios } from 'pretapo/front_end/screens/common/Payjp'
import qs from 'qs'
import PayJpBridge from './PayJpBridge';
import ErrorAlertModal from 'pretapo/front_end/screens/common/ErrorAlertModal'
import { CardForm } from './CardForm'

export class CartSettleEditPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isErrorAlertModalVisible: false
        }
    }

    static navigationOptions = ({navigation}) => ({
        title: '決済情報の編集',
        headerLeft: () => <Icon name="bars" size={28} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft:20}}/>,
        headerStyle: {
            height: hp('7%')
        }
    });

    //カード情報登録ボタン
    //トークン作成に失敗または、トークン情報をもとに顧客作成に失敗するとエラーモーダルを返す
    onSubmit = async (value) => {
        try {
            console.log('onSubmit', value)
            const token = await this.payJp.createToken(value)
            console.log('token', token)
        } catch(e) {
            console.log('error onSubmit', e)
        }
    }


    render() {
        const { isErrorAlertModalVisible } = this.state

        return(
            <SafeAreaView>
                <ErrorAlertModal
                    isModalVisible={isErrorAlertModalVisible}
                    onPressButton={() => this.setState({ isErrorAlertModalVisible: false })}
                    alertText={<Text>登録できませんでした。</Text>}
                    text={'カード番号に誤りがあるか、\n登録できないクレジットカードです。'}
                    buttonText='やり直す'
                />
                <ScrollView>
                    <PayJpBridge
                        ref={(ref) => {
                            if(ref) {
                                this.payJp = ref
                            }
                        }}
                        publicKey='pk_test_8e84ad899db7afe528aa5b42'
                    />
                    <View>
                        <Text>加入プラン（サブスクリプション）</Text>
                        <View></View>
                    </View>
                    <View>
                        <Text>初回のお支払額</Text>
                        <View></View>
                    </View>
                    <View>
                        <Text>新しいお支払い方法の追加</Text>
                        <CardForm />
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: '#7389D9'
    },
    titleStyle: {
        color: 'white'
    }
})