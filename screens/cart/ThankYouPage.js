import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Image, Button } from "react-native-elements";

export default class ItemDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <View style={styles.mainImage}>
          <Image source={require("../../assets/thankYouTaggu.png")} />
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainImageContainer: {},
  mainImage: {},
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
  }
});
