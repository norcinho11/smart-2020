import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import colors from './assets/components/colors';
import Display from './assets/components/Display';
import Header from './assets/components/Header';
import Keyboardz from './assets/components/Keyboardz';
export default function App() {
  return (
    <SafeAreaView style={styles.screen}>
      <Header title={"Phone"}/> 

  <Keyboardz/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
screen: {
    backgroundColor: colors.grey,
    flex: 1,

}
});
