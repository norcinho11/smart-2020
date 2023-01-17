import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Dimensions,
} from "react-native";
import colors from "./colors";
import Display from "./Display";
import Footer from "./Footer";

export default function Keyboardz() {
  const screen = Dimensions.get("window");
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      // justifyContent: "center",
    },
    number1: {
      backgroundColor: colors.grey,
      width: screen.width / 3,
      height: 80,
      borderBottomColor: colors.black,
      borderBottomWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      borderRightWidth: 1,
      borderLeftWidth: 1,
      borderTopWidth: 1,
      
      // alignSelf: "flex-start",
    },
    number2: {
      backgroundColor: colors.grey,
      width: screen.width / 3,
      height: 80,
      borderBottomColor: colors.black,
      borderBottomWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      borderRightWidth: 1,
      borderLeftWidth: 1,
      borderTopWidth: 1,
      
      // alignSelf: "center",
    },
    number3: {
      backgroundColor: colors.grey,
      width: screen.width / 3,
      height: 80,
      borderBottomColor: colors.black,
      borderBottomWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      borderRightWidth: 1,
      borderLeftWidth: 1,
      borderTopWidth: 1,
      // alignSelf: "flex-end",
    },
    countContainer: {
      alignItems: "center",
      padding: 10,
    },
    keypad: {
      flex: 1,
      flexDirection: "row",
    },
    text1:{
      fontSize: 40,
      justifyContent: "center",
    },
    text2:{
      fontSize: 15,
      color: colors.darkgrey,
      paddingBottom: 1
    },
    text3:{
      fontSize: 40,
      justifyContent: "center",
      paddingBottom: 20
    }

  });

  const [num, setNum] = useState([]);

  const onPress = (n) => {
    let number = num;
    if (number.length !==0 && n==="+") {
      return;
    }
    
    number.push(n);
    setNum([...number]);
         
  };

  const clear = () => {
    setNum([]);
  }
  const clearLast =()=>{
    let number =num;
    number.pop()
    setNum([...number])
  }


  return (
    <View style={styles.container}>
      <Display num={num} clear={clear} clearLast={clearLast} />
      <View style={styles.countContainer}>
      </View>
      <View style={styles.keypad}>
        <View>
          <TouchableOpacity style={styles.number1} onPress={() => onPress("1")}>
            <Text style={styles.text1}>1</Text>
            <Text style={styles.text2}>o_o</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.number1} onPress={() => onPress("4")}>
            <Text style={styles.text1}>4</Text>
            <Text style={styles.text2}>GHI</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.number1} onPress={() => onPress("7")}>
            <Text style={styles.text1}>7</Text>
            <Text style={styles.text2}>PQRS</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.number1} onPress={() => onPress("*")}>
            <Text style={styles.text1}>*</Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity style={styles.number2} onPress={() => onPress("2")}>
            <Text style={styles.text1}
             >2</Text>
            <Text style={styles.text2}>ABC</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.number2} onPress={() => onPress("5")}>
            <Text style={styles.text1}>5</Text>
            <Text style={styles.text2}>JKL</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.number2} onPress={() => onPress("8")}>
            <Text style={styles.text1}>8</Text>
            <Text style={styles.text2}>TUV</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.number2}
            onLongPress={() => onPress("+")}
            onPress={() => onPress("0")}
          >
            <Text style={styles.text1}>0</Text>
            <Text style={styles.text2}>+</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity style={styles.number3} onPress={() => onPress("3")}>
            <Text style={styles.text1}>3</Text>
            <Text style={styles.text2}>DEF</Text>
            </TouchableOpacity>

          <TouchableOpacity style={styles.number3} onPress={() => onPress("6")}>
            <Text style={styles.text1}>6</Text>
            <Text style={styles.text2}>MNO</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.number3} onPress={() => onPress("9")}>
            <Text style={styles.text1}>9</Text>
            <Text style={styles.text2}>WXYZ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.number3} onPress={() => onPress("#")}>
            <Text style={styles.text1}>#</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Footer clear={clear} num={num} />
    </View>
    
  );
  
}
