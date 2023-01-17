import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
} from 'react-native';
import {DrawerNavigatorItems} from 'react-navigation-drawer';
import {Ionicons} from '@expo/vector-icons';
import colors from './colors';

export default Sidebar = (props) => (
  <ScrollView>
    <ImageBackground // source={require("C:\Users\nvoza\Documents\planner\components\sources\suarez.PNG")}
      style={{width: undefined, padding: 16, paddingTop: 48}}>
      <Image // source={require("C:\Users\nvoza\Documents\planner\components\sources\suarez.png")}
        style={styles.profile}
      />
      <Text style={styles.name}>Norbert Vozar</Text>
    </ImageBackground>
    <View style={styles.container}>
      <DrawerNavigatorItems {...props} />
    </View>
  </ScrollView>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profile: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.black,
  },
});
