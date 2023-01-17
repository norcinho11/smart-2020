import React, {useState, useEffect} from 'react';
import MapView, {Marker} from 'react-native-maps';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Button} from 'react-native-paper';
import Geolocation from '@react-native-community/geolocation';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/Entypo';
import * as RNLocalize from 'react-native-localize';
import {useTranslation} from 'react-i18next';
import {getDistance, getPreciseDistance} from 'geolib';
import AsyncStorage from '@react-native-async-storage/async-storage';
var _ = require('lodash');
import firestore, {firebase} from '@react-native-firebase/firestore';
import PushNotification from 'react-native-push-notification';



export default function Map(props) {
  // Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function(err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});
  const [currentLocation, setCurrentLocation] = useState({});
  const [loading, setLoading] = useState(true);
  const {t, i18n} = useTranslation(['translation']);
  const [defaultDistance, setDefaultDistance] = useState(1);
  const [notifiedEvent, setNotifiedEvent] = useState([]);
  const [list, changeList] = useState([]);

  
  if (props.hideButtons) {
    useEffect(async () => {
      try {
        const value = await AsyncStorage.getItem('distance');
        if (value == defaultDistance) return;
        if (value !== null) {
          setDefaultDistance(1);
        }
        setDefaultDistance(value);
      } catch (e) {
        setDefaultDistance(1);
      }
    }, []);

    const [list, changeList] = useState([]);

    useEffect(() => {
      const subscriber = firestore()
        .collection('Notes')
        .where('userId', '==', props.user.id)
        .onSnapshot((querySnapshot) => {
          const notes = [];
          querySnapshot.forEach((documentSnapshot) => {
            const currentDate = new Date();
            if (currentDate <= documentSnapshot.data().date) {
              notes.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });
            }
          });

          changeList(notes);
        });

      // Unsubscribe from events when no longer in use
      return () => subscriber();
    }, []);

    function onResult(QuerySnapshot) {
      let notes = [];
      QuerySnapshot.forEach((documentSnapshot) => {
        const currentDate = new Date();
        const noteDate = documentSnapshot.data().date.toDate();
        if (currentDate <= noteDate) {
          notes.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        }
      });
      if (!_.isEqual(list, notes)) {
        changeList(notes);
      }
    }

    function onError(error) {
      console.error(error);
    }

    firestore().collection('Notes').onSnapshot(onResult, onError);

    useEffect(() => {
      setTimeout(() => {
        if (list.length != 0) {
          list.forEach((item) => {
            const distance = getPreciseDistance(currentLocation, item.location);
            if (distance <= defaultDistance * 1000) {
              let isIn = false;
              notifiedEvent.forEach((notItem) => {
                if (notItem.id == item.id) {
                  isIn = true;
                }
              });
              if (!isIn) {
              //  alert(item.name);
                let temp = [...notifiedEvent];
                temp.push(item);
                setNotifiedEvent(temp);
                PushNotification.localNotification({
                  title:item.name, // ide meg berakni a item.name
                  message:item.subtitle, // item.subtitle
                  ticker: 'planner', 
                  showWhen: true, // (optional) default: true
                  autoCancel: true, // (optional) default: true
                  color: 'red', // (optional) default: system default
                  vibrate: true, // (optional) default: true
                  vibration: 300,
                });
                return;
              }
              
              //Push
            } else {
              let isIn = false;
              notifiedEvent.forEach((notItem) => {
                if (notItem.id == item.id) {
                  isIn = true;
                }
              });
              if (isIn) {
                let temp = [];

                temp = notifiedEvent.filter(function (item) {
                  return item.Id != idToRemove;
                });

                setNotifiedEvent(temp);
              }
            }
          });
        }
      }, 1000);
    });
  }

  useEffect(() => {
    const getLocation = new Promise(() => {
      Geolocation.getCurrentPosition((info) => {
        setCurrentLocation({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
        setLoading(false);
      });
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (props.hideButtons) {
        const getLocation = new Promise(() => {
          Geolocation.getCurrentPosition((info) => {
            setCurrentLocation({
              latitude: info.coords.latitude,
              longitude: info.coords.longitude,
            });
          });
        });
      }
    }, 1000);
  });

  // itt most currentLocation vagy getCurrentPostion ?
  //if(distance <= myDistance){send notification}
  const ICON = () => {
    if (props.hideButtons) return null;
    return (
      <Icon
        name="location-pin"
        size={64}
        color="red"
        onPress={() => {
          Geolocation.getCurrentPosition((info) => {
            setCurrentLocation({
              latitude: info.coords.latitude,
              longitude: info.coords.longitude,
            });
          });
        }}
        style={{
          position: 'absolute',
          right: 10,
          top: 10,
        }}
      />
    );
  };

  const close = () => {
    props.close();
  };
  const save = () => {
    props.save(currentLocation);
    props.close();
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignContent: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={{flexGrow: 1}}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onLongPress={(e) => {
          if (!props.hideButtons) setCurrentLocation(e.nativeEvent.coordinate);
        }}>
        <Marker
          draggable
          coordinate={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }}
        />
      </MapView>
      {ICON()}
      {props.hideButtons ? null : (
        <View style={styles.buttons}>
          <Button marginHorizontal={8} mode="contained" onPress={() => close()}>
            {t('Close')}
          </Button>
          <Button marginHorizontal={8} mode="contained" onPress={() => save()}>
            {t('Save')}
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttons: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: 4,
  },
});
