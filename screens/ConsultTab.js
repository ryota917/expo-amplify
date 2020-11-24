import React from 'react';
import { View, StyleSheet, Text, Image, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

export default class CartTab extends React.Component {
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
        headerLeft: () => <Icon name="bars" size={28} onPress={()=>{navigation.openDrawer()}} style={{paddingLeft:20}}/>,
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

const styles = StyleSheet.create({
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
