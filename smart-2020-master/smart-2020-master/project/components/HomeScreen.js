import * as React from 'react';
import {Button, View, StyleSheet} from 'react-native';
import {Header} from 'react-native-elements';
import colors from './colors';

export default function HomeScreen() {
  return <View style={styles.container}></View>;
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
});
