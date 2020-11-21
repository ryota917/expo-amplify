import React from "react";
import { Image, View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Button } from "react-native-elements";
import { widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

export default class ItemDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation: { navigate } }) => ({
    title: 'レンタルお手続き',
    headerStyle: {
      height: hp('6%')
  }
})

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.mainImageContainer}>
            <Image
              style={styles.mainImage}
              source={require("../../assets/thankYouTaggu.png")}
            />
          </View>
          <View style={styles.confirmMessageContainer}>
            <Text style={styles.confirmMessage}>
              {"レンタルの\nお申込みが完了しました!"}
            </Text>
          </View>
          <View style={styles.thankYouMassageContainer}>
            <Text style={styles.thankYouMessage}>
              {"ご利用ありがとうございます！\nお届けまでお待ちください。"}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="戻る"
              titleStyle={{ color: "white", fontSize: 19 }}
              buttonStyle={{
                backgroundColor: "#7389D9",
                borderRadius: 40,
                width: wp("80%"),
                height: hp("7%")
              }}
              onPress={() => this.props.navigation.navigate('CartTab')}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: wp('80%'),
    //justifyContentで中央寄せする時はheight85%
    height: hp('85%'),
    left: wp('10%'),
    justifyContent: 'center',
  },
  mainImageContainer: {
    alignItems: 'center',
    marginBottom: hp('4%')
  },
  mainImage: {
    width: wp('40%'),
    height: hp('20%'),
    resizeMode: 'contain'
  },
  confirmMessageContainer: {},
  confirmMessage: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: hp('3%')
  },
  thankYouMassageContainer: {},
  thankYouMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: hp('4%')
  },
  buttonContainer: {}
});
