import MapView from 'react-native-maps';
import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {Header} from 'react-native-elements';
import Icon from 'react-native-elements';
import colors from './colors';

export default function NavigationScreen({navigation}) {
  return <View style={styles.container}></View>;
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
});
