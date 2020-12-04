import axios from 'axios'

export const PAYJP = {
    secretKey: 'sk_test_8c7639b1b4797f4ff496036a',
    publicKey: 'pk_test_8e84ad899db7afe528aa5b42'
}

export const payjpAxios = axios.create({
    baseURL: 'https://api.pay.jp/v1/',
    headers: {
        'Authorization': 'Basic c2tfdGVzdF84Yzc2MzliMWI0Nzk3ZjRmZjQ5NjAzNmE6'
    }
})