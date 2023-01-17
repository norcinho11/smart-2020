import React, {useState} from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {View, Text, Image, TouchableOpacity, Button} from 'react-native';
import {NavigationContainer, useLinkProps} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeScreen from './HomeScreen';
import NotesScreen from './NotesScreen';
import CalendarScreen from './CalendarScreen';
import CalendarItem from './CalendarItem';
import Settings from './Settings';
import NavigationScreen from './NavigationScreen';
import Login from './login';
import 'react-native-gesture-handler';
import colors from './colors';
import {Appbar} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import Map from './Map';

function App(props) {
  const {t, i18n} = useTranslation();
  const [filter, setFilter] = useState(false);
  const [filterDate, setFilterDate] = useState(null);

  /* return(
    <NotesScreen/>
  );
  */

  const Drawer = createDrawerNavigator();
  const Stack = createStackNavigator();
  const NavigationDrawerStructure = (props) => {
    const toggleDrawer = () => {
      props.navigationProps.toggleDrawer();
    };
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={toggleDrawer}>
          <Image
            source={require('./sources/drawerWhite.png')}
            style={{width: 25, height: 25, marginLeft: 5}}
          />
        </TouchableOpacity>
      </View>
    );
  };
  function HomeScreenStack({navigation}) {
    return (
      <View style={{flex: 1}}>
        <Appbar.Header>
          <Appbar.Action
            icon="menu"
            onPress={() => navigation.toggleDrawer()}
          />
          <Appbar.Content title={t('Home')} />
          <Appbar.Action
            icon="home"
            onPress={() => navigation.navigate('Home')}
          />
        </Appbar.Header>
        <NotesScreen user={props.user} filter={true} date={new Date()} />
      </View>
    );
  }
  function NavigationScreenStack({navigation}) {
    return (
      <View style={{flex: 1}}>
        <Appbar.Header>
          <Appbar.Action
            icon="menu"
            onPress={() => navigation.toggleDrawer()}
          />
          <Appbar.Content title={t('Navigation')} />
          <Appbar.Action
            icon="home"
            onPress={() => navigation.navigate('Home')}
          />
        </Appbar.Header>
        <Map user={props.user} hideButtons />
      </View>
    );
  }
  function NotesScreenStack({navigation}) {
    return (
      <View style={{flex: 1}}>
        <Appbar.Header>
          <Appbar.Action
            icon="menu"
            onPress={() => navigation.toggleDrawer()}
          />
          <Appbar.Content title={t('Notes')} />
          <Appbar.Action
            icon="home"
            onPress={() => navigation.navigate('Home')}
          />
        </Appbar.Header>
        <NotesScreen
          user={props.user}
          canShowFilterClear
          clearFilter={() => {
            setFilter(false);
            setFilterDate(null);
          }}
          filter={filter}
          date={filterDate}
        />
      </View>
    );
  }
  function CalendarScreenStack({navigation}) {
    return (
      <View style={{flex: 1}}>
        <Appbar.Header>
          <Appbar.Action
            icon="menu"
            onPress={() => navigation.toggleDrawer()}
          />
          <Appbar.Content title={t('Calendar')} />
          <Appbar.Action
            icon="home"
            onPress={() => navigation.navigate('Home')}
          />
        </Appbar.Header>
        <CalendarScreen
          user={props.user}
          setFilter={() => setFilter(true)}
          setDate={setFilterDate}
          navigation={navigation}
        />
      </View>
    );
  }
  function CalendarItemStack({navigation}) {
    return (
      <View>
        <Appbar.Header>
          <Appbar.Action
            icon="menu"
            onPress={() => navigation.toggleDrawer()}
          />
          <Appbar.Content title={t('Daily overview')} />
          <Appbar.Action
            icon="home"
            onPress={() => navigation.navigate('Home')}
          />
        </Appbar.Header>
        <CalendarItem />
      </View>
    );
  }
  function SettingsScreenStack({navigation}) {
    return (
      <View>
        <Appbar.Header>
          <Appbar.Action
            icon="menu"
            onPress={() => navigation.toggleDrawer()}
          />
          <Appbar.Content title={t('Settings')} />
          <Appbar.Action
            icon="home"
            onPress={() => navigation.navigate('Home')}
          />
        </Appbar.Header>
        <Settings />
      </View>
    );
  }

  function SignOutButton(items) {
    return (
      <DrawerContentScrollView {...items}>
        <DrawerItemList {...items} />
        <DrawerItem label={t('Sign Out')} onPress={() => props.signOut()} />
      </DrawerContentScrollView>
    );
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName={t('Home')}
        drawerContent={(props) => <SignOutButton {...props} />}>
        <Drawer.Screen name={t('Home')} component={HomeScreenStack} />
        <Drawer.Screen name={t('Notes')} component={NotesScreenStack} />
        <Drawer.Screen name={t('Calendar')} component={CalendarScreenStack} />
        {/* <Drawer.Screen name={t('Calend-arItem')} component={CalendarItemStack} /> */}
        <Drawer.Screen name={t('Maps')} component={NavigationScreenStack} />
        <Drawer.Screen name={t('Settings')} component={SettingsScreenStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
