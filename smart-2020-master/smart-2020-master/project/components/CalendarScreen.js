import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import 'react-native-gesture-handler';
import colors from './colors';
import {Header} from 'react-native-elements';
import {FontAwesome5} from '@expo/vector-icons';
import CalendarItem from './CalendarItem';
import {CommonActions} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {LocaleConfig} from 'react-native-calendars';
import {createStackNavigator} from '@react-navigation/stack';
import NotesScreen from './NotesScreen';
import firestore, {firebase} from '@react-native-firebase/firestore';

LocaleConfig.locales['sk'] = {
  monthNames: [
    'Január',
    'Február',
    'Marec',
    'Apríl',
    'Máj',
    'Jún',
    'Júl',
    'August',
    'September',
    'Október',
    'November',
    'December',
  ],
  monthNamesShort: [
    'Jan.',
    'Feb.',
    'Marec',
    'April',
    'Máj',
    'Jún',
    'Júl',
    'Aug.',
    'Sept.',
    'Oct.',
    'Nov.',
    'Dec.',
  ],
  dayNames: [
    'Nedeľa',
    'Pondelok',
    'Utorok',
    'Streda',
    'Štvrtok',
    'Piatok',
    'Sobota',
  ],
  dayNamesShort: ['Ned', 'Pon', 'Ut', 'Str', 'Štv', 'Pia', 'Sob'],
  today: 'Dnes',
};
LocaleConfig.defaultLocale = 'sk';

export default function CalendarScreen(props) {
  const {t, i18n} = useTranslation(['translation']);
  const colorizeItems = () => {};
  var _ = require('lodash');

  const openCalendarItem = () => {
    // console.log('clicked');
    //props.navigation -> itt elerheted a navigationt
    props.navigation.navigate('CalendarItem');
  };
  const [dates, setDates] = useState({});

  useEffect(() => {
    const subscriber = firestore()
      .collection('Notes')
      .where('userId', '==', props.user.id)
      .onSnapshot((querySnapshot) => {
        const tempDates = {};
        querySnapshot.forEach((documentSnapshot) => {
          let date = documentSnapshot.data().date.toDate();
          let day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate();
          let month =
            date.getDate() <= 8
              ? '0' + (date.getMonth() + 1)
              : date.getMonth() + 1;
          let dateKey = `${date.getFullYear()}-${month}-${day}`;
          tempDates[`${dateKey}`] = {marked: true};
        });
        setDates(tempDates);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  function onResult(QuerySnapshot) {
    let tempDates = {};
    QuerySnapshot.forEach((documentSnapshot) => {
      let date = documentSnapshot.data().date.toDate();
      let day = date.getDate() <= 9 ? '0' + date.getDate() : date.getDate();
      let month =
        date.getDate() <= 8 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
      let dateKey = `${date.getFullYear()}-${month}-${day}`;
      tempDates[`${dateKey}`] = {marked: true};
    });

    if (!_.isEqual(tempDates, dates)) {
      setDates(tempDates);
    }
  }

  function onError(error) {
    console.error(error);
  }

  firestore().collection('Notes').onSnapshot(onResult, onError);

  const [filterDate, setFilterDate] = useState(new Date());

  const Stack = createStackNavigator();

  const CalendarStack = ({navigation}) => {
    return (
      <View style={styles.container}>
        <CalendarList
          markedDates={dates}
          locales="sk"
          onDayPress={(day) => {
            let newDate = new Date(day.timestamp);
            setFilterDate(newDate);
            navigation.navigate('Filtered');
            // props.setFilter();
            // props.setDate(newDate);
            // console.log(props.navigation);
          }}
          // Callback which gets executed when visible months change in scroll view. Default = undefined
          onVisibleMonthsChange={(months) => {
            // console.log('now these months are visible', months);
          }}
          // Max amount of months allowed to scroll to the past. Default = 50
          pastScrollRange={50}
          // Max amount of months allowed to scroll to the future. Default = 50
          futureScrollRange={50}
          // Enable or disable scrolling of calendar list
          scrollEnabled={true}
          // Enable or disable vertical scroll indicator. Default = false
          showScrollIndicator={true}
        />
      </View>
    );
  };

  const FilteredStack = ({navigation}) => {
    return (
      <NotesScreen
        user={props.user}
        canShowFilterClear
        clearFilter={() => navigation.navigate('Calendar')}
        filter={true}
        date={filterDate}
      />
    );
  };

  return (
    <Stack.Navigator headerMode="none" initialRouteName="Calendar">
      <Stack.Screen name="Calendar" component={CalendarStack} />
      <Stack.Screen name="Filtered" component={FilteredStack} />
    </Stack.Navigator>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
});
