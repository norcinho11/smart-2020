import React, {useState, useEffect, useReducer} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Drawer from './components/Drawer';
import auth from '@react-native-firebase/auth';

import './i18n';
import {useTranslation} from 'react-i18next';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Dimensions,
  View,
  Image,
  Text,
  StatusBar,
  Alert,
} from 'react-native';

import {Header, LearnMoreLinks} from 'react-native/Libraries/NewAppScreen';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import Map from './components/Map';
import {TextInput, Button} from 'react-native-paper';
import HomeScreen from './components/HomeScreen';
import colors from './components/colors';
import {withTranslation} from 'react-i18next';
import CalendarScreen from './components/CalendarScreen';

const screen = Dimensions.get('window');
function Login() {
  const logo4 = require('./components/sources/logo4.png');

  const [loggedIn, setloggedIn] = useState(false);
  const [userInfo, setuserInfo] = useState([]);
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [registration, setRegistration] = useState(false);
  const {t, i18n} = useTranslation(); 
  // const dispatch = useDispatch();
  const onAuthStateChanged = (userInfo) => {
    console.log(userInfo);
    if (userInfo != null || userInfo != undefined) {
      if (userInfo.id == undefined) {
        let temp = {id: userInfo.uid};
        setuserInfo(temp);
      } else setuserInfo(userInfo);
    } else setuserInfo(userInfo);
  };
  const showAlert = () =>
    Alert.alert(
      'Warning!',
      'You have to fill in all placeholders!',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {user} = await GoogleSignin.signIn();
      setuserInfo(user);
      setloggedIn(true);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        alert('Cancel');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Signin in progress');
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('PLAY_SERVICES_NOT_AVAILABLE');
        // play services not available or outdated
      } else console.log(error);
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '286143843986-kaqboe54klpah7a4d3lvq9gs6dkp0n58.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
  }, []);

  const signOut = async () => {
    try {
      setMail('');
      setPassword('');
      auth().signOut();
      setloggedIn(false);
      setuserInfo([]);
      return;
    } catch (error) {
      console.error(error);
    }
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setloggedIn(false);
      setuserInfo([]);
    } catch (error) {
      console.error(error);
    }
  };

  const signIn = () => {
    if (mail === null || password === null) {
      showAlert();
      return;
    }
    if (mail === '' || password === '') {
      showAlert();
      return;
    }
    auth()
      .signInWithEmailAndPassword(mail, password)
      .then(() => setloggedIn(true))
      .catch((error) => {
        if (error.code === 'auth/invalid-email') {
          ToastAndroid.show(
            'That email address is invalid!',
            ToastAndroid.LONG,
          );
        }
        if (error.code === 'auth/user-not-found')
          ToastAndroid.show('Mail not found', ToastAndroid.LONG);
        if (error.code === 'auth/wrong-password')
          ToastAndroid.show('Wrong password', ToastAndroid.LONG);
      });
  };

  const signUp = () => {
    auth()
      .createUserWithEmailAndPassword(mail, password)
      .then(() => {
        setloggedIn(true);
      })
      .catch((error) => {
        if (error.code === '/email-already-in-use') {
          ToastAndroid.show(
            'That email address is already in use!',
            ToastAndroid.LONG,
          );
        }

        if (error.code === 'auth/invalid-email') {
          ToastAndroid.show(
            'That email address is invalid!',
            ToastAndroid.LONG,
          );
        }
      });
  };

  if (loggedIn) {
    return <Drawer user={userInfo} signOut={signOut} />;
  }

  if (registration) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View>
          <TextInput
            value={mail}
            label={t('Mail')}
            keyboardType="email-address"
            onChangeText={(text) => setMail(text)}
          />
          <TextInput
            value={password}
            label={t('Password')}
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
          />
          <Button onPress={signUp}>{t('Sign up')}</Button>
          <Button
            onPress={() => {
              setRegistration(false);
              setMail('');
              setPassword('');
            }}>
            {t('Close')}
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image style={styles.obrazok} source={logo4} />
      <Text style={{alignSelf: 'center'}}>{t('Log in to continue:')}</Text>
      <StatusBar barStyle="default" />
      <View>
        <TextInput
          color="#52799E"
          value={mail}
          label={t('Mail')}
          keyboardType="email-address"
          onChangeText={(text) => setMail(text)}
        />
        <TextInput
          color="#52799E"
          value={password}
          label={t('Password')}
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />
        <Button color="#52799E" onPress={signIn}>
          {t('Sign In')}
        </Button>
        <Button
          color="#52799E"
          onPress={() => {
            setRegistration(true);
            setMail('');
            setPassword('');
          }}>
          {t('Sign Up')}
        </Button>
      </View>

      <GoogleSigninButton
        style={({width: 192, height: 55}, styles.googleButton)}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={_signIn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  googleButton: {
    alignSelf: 'center',
  },
  obrazok: {
    alignItems: 'center',
  },
});

export default withTranslation()(Login);
