import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
  View,
  Text,
  Linking,
  Dimensions,
  Image
} from "react-native";
import colors from "./colors";


const call_on = require("/home/norbert/dialer/assets/call_on.png");
    const call_off = require("/home/norbert/dialer/assets/call_off.png");

const Footer = (props) => {
  const screen = Dimensions.get("window");
     

  const [call, setCall] = useState(false);

  const clearLast = () => {
    if (props.num.length != 0 || call === null) {
      props.clearLast;
      return;
    }
  }
  const clear = () => {
    if (props.num.length == 0 || call === null) {
      setCall(false);
      props.clear();
      return;
    }
    alert(props.num.join(""));
    let res = !call;
    setCall(res);
    let number = "";
    if (Platform.OS === "ios") {
      number = `telprompt:${props.num.join("")}`;
    } else {
      number = `tel:${props.num.join("")}`;
    }
    Linking.openURL(number);
    Linking.openURL(props.num.join(""));
    props.clear();
  };
  const styles = StyleSheet.create({
    container: {
      // flex: 1,
      width: screen.width,
      maxWidth: screen.width,
    
    },
    button: {
      fontSize: 43,
      alignSelf: "center",
    },
    obrazok: {
        width: 54,
        height: 54,
        flexDirection: "row",
        alignSelf: "center",
        //  position: "absolute",
        
    },
  });

  return (
    <View
      style={(styles.container, { backgroundColor: call ? call_off : call_on })}
    >
      <TouchableOpacity onPress={clear}>
         <Image style={styles.obrazok} source={call ? call_off : call_on}></Image> 
      </TouchableOpacity>
 
          </View>
  );
};
export default Footer;
