import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { View, TextInput, Text, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

export const CardForm = (props) => {
    const { onSubmit } = props
    const { control, handleSubmit, errors } = useForm()
    const cardNumberInputRef = React.useRef()
    const onHandleSubmit = data => {
        const expMonth = data.expireDate.slice(0, 2)
        const expYear = '20' + data.expireDate.slice(2)
        const card = {
            number: data.number,
            cvc: data.cvc,
            exp_month: expMonth,
            exp_year: expYear
        }
        onSubmit(card)
    }

    console.log('errors', errors)

    return(
        <View style={styles.cardFormContainer}>
            <View style={styles.innerContainer}>
                {/* カード番号 */}
                <Text style={styles.inputText}>カード番号</Text>
                {errors.number?.type === 'required' && <Text style={styles.errorText}>入力されていません</Text>}
                {errors.number?.type === 'minLength' && <Text style={styles.errorText}>無効です</Text>}
                {errors.number?.type === 'maxLength' && <Text style={styles.errorText}>無効です</Text>}
                <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => {
                        return(
                            <TextInput
                                style={styles.input}
                                placeholder='1111222233334444'
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                                keyboardType='numeric'
                                ref={cardNumberInputRef}
                            />
                        )
                    }}
                    name='number'
                    defaultValue=''
                    onFocus={() => {
                        cardNumberInputRef.current.focus()
                        console.log('cardNumberInputRef', cardNumberInputRef)
                    }}
                    rules={{
                        required: true,
                        minLength: 16,
                        maxLength: 16
                    }}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* 有効期限 */}
                    <View style={{ marginRight: 40 }}>
                        <Text style={styles.inputText}>有効期限</Text>
                        {errors.expireDate?.type === 'required' && <Text style={styles.errorText}>入力されていません</Text>}
                        {errors.expireDate?.type === 'minLength' && <Text style={styles.errorText}>無効です</Text>}
                        {errors.expireDate?.type === 'maxLength' && <Text style={styles.errorText}>無効です</Text>}
                        <Controller
                            control={control}
                            render={({ onChange, onBlur, value }) => {
                                return(
                                    <TextInput
                                        style={styles.input}
                                        placeholder='0124'
                                        onBlur={onBlur}
                                        keyboardType='numeric'
                                        onChangeText={value => onChange(value)}
                                        value={value}
                                    />
                                )
                            }}
                            name='expireDate'
                            defaultValue=''
                            rules={{
                                required: true,
                                minLength: 4,
                                maxLength: 4
                            }}
                        />
                    </View>
                    {/* セキュリティコード */}
                    <View>
                        <Text style={styles.inputText}>セキュリティコード</Text>
                        {errors.cvc?.type === 'required' && <Text style={styles.errorText}>入力されていません</Text>}
                        {errors.cvc?.type === 'minLength' && <Text style={styles.errorText}>無効です</Text>}
                        {errors.cvc?.type === 'maxLength' && <Text style={styles.errorText}>無効です</Text>}
                        <Controller
                            control={control}
                            render={({ onChange, onBlur, value }) => {
                                return(
                                    <TextInput
                                        style={styles.input}
                                        placeholder='123'
                                        onBlur={onBlur}
                                        keyboardType='numeric'
                                        onChangeText={value => onChange(value)}
                                        value={value}
                                    />
                                    )
                                }}
                                name='cvc'
                                defaultValue=''
                                rules={{
                                    required: true,
                                    minLength: 3,
                                    maxLength: 3
                                }}
                        />
                    </View>
                </View>
                {/* 名義 */}
                {/* <Text style={styles.inputText}>名義</Text>
                {errors.name?.type === 'required' && <Text style={styles.errorText}>入力されていません</Text>}
                <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => {
                        return(
                            <TextInput
                                style={styles.input}
                                placeholder='TANAKA TARO'
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                            />
                        )
                    }}
                    name='name'
                    defaultValue=''
                    rules={{ required: true }}
                /> */}
                <View style={styles.bottonContainer}>
                    <Button
                        title='登録して支払いへ'
                        onPress={handleSubmit(onHandleSubmit)}
                        buttonStyle={styles.registerButtonStyle}
                        titleStyle={styles.registerTitleStyle}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardFormContainer: {
        backgroundColor: 'white'
    },
    innerContainer: {
        width: wp('90%'),
        left: wp('5%'),
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 13,
        borderColor: 'silver',
        fontSize: 14,
        letterSpacing: 1
    },
    inputText: {
        margin: 10,
        marginTop: 15,
        marginLeft: 5,
        color: '#333333',
        fontSize: 14,
        letterSpacing: 1
    },
    bottonContainer: {
        alignItems: 'center'
    },
    registerButtonStyle: {
        margin: 25,
        alignItems: 'center',
        width: 200,
        borderRadius: 60,
        height: 45,
        backgroundColor: '#7389D9',
        alignItems: 'center'
    },
    registerTitleStyle: {},
    errorText: {
        color: '#A60000',
        margin: 5,
        fontSize: 12,
    }
})