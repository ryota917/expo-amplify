import React from "react";
import { Image, View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-elements";

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
            source={require("../../assets/errorIconTaggu.png")}
          />
        </View>
        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessage}>
            {
              "通信に問題が発生しました。\nお手数ですが，ホーム画面から\nやり直してください。"
            }
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
  errorMessageContainer: {},
  errorMessage: {
    fontFamily: "Noto Sans JP",
    fontSize: 16,
    textAlign: "center"
  },
  buttonContainer: {} //TODO: ボタンのスタイリング．
});
