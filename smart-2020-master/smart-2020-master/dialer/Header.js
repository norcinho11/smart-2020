import React from "react";
import { StyleSheet, Text, SafeAreaView, Dimensions } from "react-native";
import colors from "./colors";
const Header = (props) => {
  const screen = Dimensions.get("window");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.green,
      width: screen.width,
      maxWidth: screen.width,
      height: screen.height / 6,
      maxHeight: screen.height / 6,
    },
    Text: {
      color: colors.white,
      alignItems: "flex-start",
      fontSize: 28,
      paddingTop: 30
    },
  });
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.Text}>{props.title}</Text>
    </SafeAreaView>
  );
};
export default Header;
