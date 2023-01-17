import React, { useState } from "react";
import { StyleSheet, Text,TouchableOpacity, View,Image, Dimensions } from "react-native";
import colors from "./colors";



export default function Display(props) {
  const screen = Dimensions.get("window");
  const deleter= require("/home/norbert/dialer/assets/deleter.png");

  
  const [num, setNum] = useState([]);
  
  const clear = () => {
  setNum([]);
}
const clearLast =()=>{
  let number =num;
  number.pop()
  setNum([...number])
  
}


const isNum = ()=>{
  let numberb=num;
  if (numberb.length !== null) {
    return true;
  }
  else return false;
}
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      width: screen.width/8,
      height:100,
    },
    text: {
      color: "black",
      paddingTop: 0,
      backgroundColor: colors.grey,
      width: screen.width-40,
      borderBottomColor: colors.black,
      alignItems: 'center',
      fontSize: 40,
      alignSelf:"flex-start",
    },
    deleter:{
      color:colors.darkgrey,
      width:40,
      height:40,
      alignSelf: "flex-end",
      
      
  },
  });

  return (
    <View style={styles.container}>
      <Text numberOfLines= {2}
      style={styles.text}>{props.num}</Text>

      <TouchableOpacity onPress={props.clearLast} onLongPress={props.clear}>
      <Image style={styles.deleter} source={isNum ? deleter : null} >  
    </Image> 
         
      </TouchableOpacity>
      </View>
  );
}
