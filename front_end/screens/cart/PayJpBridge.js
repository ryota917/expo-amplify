import React from 'react'
import { WebView } from 'react-native-webview'

let payJpJs = null
const PAY_JP_JS_URL= 'https://js.pay.jp/'

export default class PayJpBridge extends React.Component {
    callbacks = {}
    loaded = false

    constructor(props) {
        super(props)
        this.eventHandlers = {
            TOKEN: this.onToken,
            LOG: console.log
        }
    }

    // payjp.jsを読み込む
    //@returnes {Promise<string>}
    getPayJpJs = async () => {
        if(payJpJs) {
            return payJpJs
        } else {
            const res = await fetch(PAY_JP_JS_URL)
            console.log('payjpを読み込みます fetch_payjp_url:', res)
            return await res.text()
        }
    }

    //WebViewからのデータを処理
    //@params event
    onMessage = event => {
        console.log('onMessage', event.nativeEvent.data)
        const json = JSON.parse(event.nativeEvent.data)
        const { data, type } = json
        this.eventHandlers[type] && this.eventHandlers[type](data)
    }

    //トークン作成時
    //@params {object} data
    onToken = data => {
        try {
            const error = data.error && JSON.parse(data.error)
            const token = data.token && JSON.parse(data.token)
            console.log('作成されたトークン token:', token)
            const callback = this.callbacks[data.callbackKey]
            callback && callback(token, error)
        } catch(e) {
            console.error('トークン作成時のエラー', e)
        }
    }

    //カードトークンの作成
    // @params {object} card
    // @returns {Promise<any>}
    createToken = async (card) => {
        return new Promise((resolve, reject) => {
            if(this.loaded) {
                const callbackKey = (+new Date()).toString()
                this.callbacks[callbackKey] = (token, error) => {
                    if(token) {
                        console.log('createToken内で読み込まれました。token:', token)
                        resolve(token)
                    } else {
                        console.error('createToken内でエラーが発生しました。error:', error)
                        reject(new Error(error.description || error.message))
                    }
                }
                this.WebView.injectJavaScript(
                    `createToken(${JSON.stringify(card)}, ${callbackKey})`
                )
            } else {
                reject(new Error('PayJPが初期化されていません'))
            }
        })
    }

    onLoad = async () => {
        console.log('onLoad内の処理です')
        const { publicKey } = this.props
        const payJpJs = await this.getPayJpJs()
        this.WebView.injectJavaScript(payJpJs)
        this.WebView.injectJavaScript(`
            Payjp.setPublicKey('${publicKey}')

            function postMessage(type, data) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type, data }))
            }

            function createToken(card, callbackKey) {
                try {
                    Payjp.createToken(card, function(status, response) {
                        if(status === 200) {
                            postMessage('TOKEN', {
                                callbackKey: callbackKey,
                                token: JSON.stringify(response)
                            })
                        } else {
                            postMessage('TOKEN', {
                                callbackKey: callbackKey,
                                error: JSON.stringify(response.error)
                            })
                        }
                    })
                } catch(e) {
                    postMessage('LOG', e.message)
                }
            }
        `)
        this.loaded = true
    }

    render() {
        return(
            <WebView
                ref={ref => {
                    if(ref) {
                        this.WebView = ref
                    }
                }}
                scrollEnabled={false}
                bounces={false}
                source={{
                    uri: 'https://amazon.com'
                }}
                onLoad={this.onLoad}
                onMessage={this.onMessage}
                style={{
                    width: 0,
                    height: 0
                }}
            />
        )
    }
}