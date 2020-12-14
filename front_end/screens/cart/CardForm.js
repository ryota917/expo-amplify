import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { View, TextInput, Text, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

export const CardForm = () => {
    const { control, register, handleSubmit, errors, reset } = useForm()
    const cardNumberInputRef = React.useRef()
    const onSubmit = data => {
        console.log(data)
    }

    console.log('errors', errors)

    return(
        <View style={styles.cardFormContainer}>
            <View style={styles.innerContainer}>
                {/* カード番号 */}
                <Text>カード番号</Text>
                {errors.cardNumber && <Text>無効なカード番号です</Text>}
                <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => {
                        return(
                            <TextInput
                                placeholder='1111-1111-1111-1111'
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                                ref={cardNumberInputRef}
                            />
                        )
                    }}
                    name='cardNumber'
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
                <View style={{ flexDirection: 'row' }}>
                    {/* 有効期限 */}
                    <View style={{ marginRight: 10 }}>
                        <Text>有効期限</Text>
                        {errors.expireDate && <Text>無効です</Text>}
                        <Controller
                            control={control}
                            render={({ onChange, onBlur, value }) => {
                                return(
                                    <TextInput
                                        placeholder='MM/YY'
                                        onBlur={onBlur}
                                        onChangeText={value => onChange(value)}
                                        value={value}
                                    />
                                )
                            }}
                            name='expireDate'
                            defaultValue=''
                            rules={{ required: true }}
                        />
                    </View>
                    {/* セキュリティコード */}
                    <View>
                        <Text>セキュリティコード</Text>
                        {errors.securityCode && <Text>無効なセキュリティコードです</Text>}
                        <Controller
                            control={control}
                            render={({ onChange, onBlur, value }) => {
                                return(
                                    <TextInput
                                    placeholder='testtest'
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={value}
                                    />
                                    )
                                }}
                                name='securityCode'
                                defaultValue=''
                                rules={{
                                    required: 'securityCode is required',
                                    minLength: 3,
                                    maxLength: 3
                                }}
                        />
                    </View>
                </View>
                {/* 名義 */}
                <Text>名義</Text>
                <Controller
                    control={control}
                    render={({ onChange, onBlur, value }) => {
                        return(
                            <TextInput
                                placeholder='testtest'
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)}
                                value={value}
                            />
                        )
                    }}
                    name='name'
                    defaultValue=''
                    rules={{ required: true }}
                />
                <Button
                    title='登録して支払いへ'
                    onPress={handleSubmit(onSubmit)}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardFormContainer: {
        backgroundColor: 'white'
    },
    innerContainer: {
        width: wp('80%'),
        left: wp('10%')
    }
})