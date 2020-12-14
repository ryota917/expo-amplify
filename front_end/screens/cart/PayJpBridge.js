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
            console.log('getPayJpJs内の処理です', res)
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
        const error = data.error && JSON.parse(data.error)
        console.log('onToken時のエラー', error)
        const token = data.token && JSON.parse(data.token)
        console.log('onTokenのtoken', token)
        const callback = this.callbacks[data.callbackKey]
        console.log('callback', callback)
        callback && callback(token, error)
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
                        console.log('token in PayJpBridge', token)
                        resolve(token)
                    } else {
                        console.error('error occurring', error)
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