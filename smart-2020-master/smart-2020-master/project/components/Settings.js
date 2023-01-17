import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import colors from './colors';
import {useTranslation} from 'react-i18next';
import RNRestart from 'react-native-restart';
import i18n from '../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screen = Dimensions.get('window');
export default function Settings() {
  const {t, i18n} = useTranslation(['translation']);
  const hungary_flag = require('./sources/hungary_flag.png');
  const slovakia_flag = require('./sources/slovakia_flag.png');
  const england_flag = require('./sources/england_flag.png');
  const czech_flag = require('./sources/czech_flag.png');
  const [defaultDistance, setDefaultDistance] = useState(1);

  useEffect(() => {
    async () => {
      try {
        const value = await AsyncStorage.getItem('distance');
        setDefaultDistance(value);
        if (value == null) {
          setDefaultDistance(1);
        }
      } catch (e) {
        setDefaultDistance(1);
      }
    };
  }, []);

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('distance', defaultDistance);
      RNRestart.Restart();
    } catch (e) {
      await AsyncStorage.setItem('distance', 1);
    }
  };

  const listLanguage = [
    {key: 'en', label: 'en'},
    {key: 'sk', label: 'sk'},
    {key: 'hu', label: 'hu'},
    {key: 'cz', label: 'cz'},
  ];
  const changeAppLanguage = (lang) => {
    i18n.changeLanguage(lang);
    // RNRestart.Restart();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>"Choose app language:"</Text>
      <View style={styles.container1}>
        <TouchableOpacity onPress={() => changeAppLanguage('sk')}>
          <Image style={styles.obrazok} source={slovakia_flag} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeAppLanguage('en')}>
          <Image style={styles.obrazok} source={england_flag} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeAppLanguage('hu')}>
          <Image style={styles.obrazok} source={hungary_flag} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeAppLanguage('cz')}>
          <Image style={styles.obrazok} source={czech_flag} />
        </TouchableOpacity>
      </View>
      <Text style={styles.text}>
        "Choose localization area length for notifications:"
      </Text>
      <View>
        <TextInput
          keyboardType="numeric"
          value={defaultDistance}
          onChangeText={(dist) => setDefaultDistance(dist)}></TextInput>
        <Button onPress={() => saveData()}>{t('Save')}</Button>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container1: {
    padding: 15,
    flexDirection: 'row',
    width: screen.width,
    maxWidth: screen.width,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    fontSize: 43,
    alignSelf: 'center',
  },
  obrazok: {
    width: 54,
    height: 54,
    flexDirection: 'row',
    marginRight: 22,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    //  position: "absolute",
  },
  container: {
    backgroundColor: colors.backgroundlight,
  },
  text: {
    fontSize: 22,
    backgroundColor: colors.white,
  },
});
