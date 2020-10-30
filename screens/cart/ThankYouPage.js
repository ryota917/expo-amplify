import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image, Button } from "react-native-elements";

export default class ItemDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
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
            title="ホームへ戻る"
            titleStyle={{ color: "white" }}
            buttonStyle={{
              backgroundColor: "#7389D9",
              borderRadius: 23,
              width: wp("80%"),
              height: hp("7%")
            }}
            //   onPress={TODO: 画面の遷移}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainImageContainer: {},
  mainImage: {}, // TODO: メイン画像のスタイリング
  confirmMessageContainer: {},
  confirmMessage: {
    fontFamily: "Noto Sans JP",
    fontSize: 16,
    textAlign: "center"
  },
  thankYouMassageContainer: {},
  thankYouMessage: {
    fontFamily: "Noto Sans JP",
    fontSize: 11,
    textAlign: "center"
  },
  buttonContainer: {} //TODO: ボタンのスタイリング．
});
