import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import {Header, ListItem} from 'react-native-elements';
import Icon from 'react-native-elements';
import colors from './colors';
import {Modal, Portal, Button, Provider, TextInput} from 'react-native-paper';
import {useCardAnimation} from '@react-navigation/stack';
import firestore, {firebase} from '@react-native-firebase/firestore';
import DatePicker from 'react-native-date-picker';
import Map from './Map';
import {useTranslation} from 'react-i18next';


var _ = require('lodash');

import {ActivityIndicator} from 'react-native';

export default function NotesScreen(props) {
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [itemVisible, setItemVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [users, setUsers] = useState([]); // Initial empty array of users
  const [date, setDate] = useState(new Date());
  const [editTime, setEditTime] = useState(false);
  const [list, changeList] = useState([]);
  const filterDate = props.date;
  const [location, setLocation] = useState(null);
  const [selectLocation, setSelectLocation] = useState(false);
  const { t, i18n } = useTranslation(["translation"]);

  useEffect(() => {
    const subscriber = firestore()
      .collection('Notes')
      .where('userId', '==', props.user.id)
      .onSnapshot((querySnapshot) => {
        const notes = [];
        querySnapshot.forEach((documentSnapshot) => {
          if (props.filter) {
            let docDate = documentSnapshot.data().date;
            let startFilterDate = filterDate;
            let endFilterDate = new Date(filterDate);
            endFilterDate.setDate(endFilterDate.getDate() + 1);
            const newDate = docDate.toDate();
            if (newDate <= endFilterDate && startFilterDate <= newDate) {
              notes.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
              });
            }
          } else {
            notes.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          }
        });

        changeList(notes);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  function onResult(QuerySnapshot) {
    let notes = [];
    QuerySnapshot.forEach((documentSnapshot) => {
      if (props.filter) {
        let docDate = documentSnapshot.data().date;
        let startFilterDate = filterDate;
        let endFilterDate = new Date(filterDate);
        endFilterDate.setDate(endFilterDate.getDate() + 1);
        const newDate = docDate.toDate();
        if (newDate <= endFilterDate && startFilterDate <= newDate) {
          notes.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        }
      } else {
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

  const showItemModal = (id) => {
    setCurrentItem(id);
    setItemVisible(true);
  };
  const hideItemModal = () => {
    setCurrentItem(null);
    setItemVisible(false);
  };
  const containerStyle = {backgroundColor: 'white', padding: 20};
  const [myName, setMyName] = useState('');

  const [mySubtitle, setMySubtitle] = useState('');

  const getItems = () => {
    let items = [];

    list.map((l, i) => {
      items.push(
        <ListItem
          key={i}
          bottomDivider
          onPress={() => {
            setEditing(false);
            showItemModal(l.id);
          }}>
          <ListItem.Content>
            <ListItem.Title>{l.name}</ListItem.Title>
            <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>,
      );
    });
    return items;
  };


  const getItem = () => {
    if (!itemVisible) return;
    let item = list.find((item) => item.id == currentItem);
    if (item == null) {
      hideItemModal();
      return;
    }

    if (loading) {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View>
        <Text>{item.name}</Text>
        <Text>{item.subtitle}</Text>
        <Text>{Date(item.date)}</Text>
        {item.location != undefined ? (
          <Button
            onPress={() =>
              Linking.openURL(
                `geo:0,0?q=${item.location.latitude},${item.location.longitude}`,
              )
            }>
            {t("Open in map")}
          </Button>
        ) : null}
        <Button
          onPress={() => {
            setEditing(true);
            setEditTime(false);
            let item = list.find((item) => item.id == currentItem);
            if (item == null) {
              hideItemModal();
              return;
            }
            setEditName(item.name);
            setEditSubtitle(item.subtitle);
            setDate(item.date);
            setLocation(null);
            try {
              setLocation(item.location);
            } catch {}
          }}>
          {t("Edit")}
        </Button>
        <Button onPress={deleteItem}>{t("Delete")}</Button>
      </View>
    );
  };

  const getEditItem = () => {
    // if (!itemVisible) return;
    const oldTime = date;
    return (
      <View>
        <View>
          <TextInput
            value={editName}
            label={t("Name")}
            onChangeText={(text) => setEditName(text)}
          />
          <TextInput
            multiline
            value={editSubtitle}
            label={t("Subtitle")}
            onChangeText={(text) => setEditSubtitle(text)}
          />
        </View>
        {editTime ? <DatePicker date={date} onDateChange={setDate} /> : null}
        {editTime ? (
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Button
              style={{marginTop: 10}}
              onPress={() => {
                setEditTime(!editTime);
              }}>
              {t("Confirm")}
            </Button>
            <Button
              style={{marginTop: 10}}
              onPress={() => {
                setEditTime(!editTime);
                setDate(oldTime);
              }}>
              {t("Cancel")}
            </Button>
          </View>
        ) : (
          <View>
            <Button
              style={{marginTop: 10}}
              onPress={() => setEditTime(!editTime)}>
              {t("Edit time")}
            </Button>
            <Button
              style={{marginTop: 10}}
              onPress={() => setSelectLocation(true)}>
              {t("Edit location")}
            </Button>
          </View>
        )}
        <Button style={{marginTop: 10}} onPress={() => saveChange(currentItem)}>
          {t("Save")}
        </Button>
      </View>
    );
  };

  const saveChange = (id) => {
    const document = list.find((item) => item.id == id);

    console.log(document.key);

    if (document != null)
      firestore().collection('Notes').doc(document.key).update({
        name: editName,
        subtitle: editSubtitle,
        date: date,
        location: location,
      });
    setEditName('');
    setCurrentItem('');
    setEditSubtitle('');
    setEditing(false);
    hideItemModal();
    // let tempList = [...list];
    // tempList.forEach((item) => {
    //   if (item.id == id) {
    //     item.name = editName;
    //     item.subtitle = editSubtitle;
    //     setEditName('');
    //     setEditSubtitle('');
    //     setEditing(false);
    //     hideItemModal();
    //   }
    // });

    // changeList(tempList);
  };

  const addListItem = () => {
    firestore()
      .collection('Notes')
      .add({
        name: myName,
        subtitle: mySubtitle,
        id: `${myName}_${Date().toString()}`,
        user: props.user.id,
        date: date,
        location: location,
      })
      .then(() => {
        console.log('Note added!');
        hideModal();
        setMyName('');
        setMySubtitle('');
      });

    // if (myName != '' && mySubtitle != '') {
    //   let tempList = [...list]; //vytvorim kopiu
    //   tempList.push({
    //     name: myName,
    //     age: mySubtitle,
    //     id: newId,
    //     user: userId,
    //   });
    // changeList(tempList);
    // return;
    // }
  };

  if (selectLocation) {
    return <Map close={() => setSelectLocation(false)} save={setLocation} />;
  }

  const deleteItem = () => {
    // let tempList = [...list]; //vytvorim kopiu
    // tempList = tempList.filter(function (item) {
    //   return item.id != currentItem;
    // });
    // changeList(tempList);
    const document = list.find((item) => item.id == currentItem);
    firestore()
      .collection('Notes')
      .doc(document.key)
      .delete()
      .then(() => {
        setEditName('');
        setCurrentItem('');
        setEditSubtitle('');
        setEditing(false);
        hideItemModal();
      });
  };
  return (
    <Provider style={styles.container}>
      {props.canShowFilterClear && props.filter ? (
        <Button onPress={() => props.clearFilter()}>{t("Close")}</Button>
      ) : null}
      <Portal style={styles.container}>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}>
          <TextInput
            label={t("Name")}
            value={myName}
            onChangeText={(text) => setMyName(text)}
          />
          <TextInput
            multiline
            label={t("Subtitle")}
            value={mySubtitle}
            onChangeText={(text) => setMySubtitle(text)}
          />
          <DatePicker onDateChange={setDate} date={date} />
          <Button onPress={setSelectLocation}>{t("Location")}</Button>
          <Button onPress={addListItem}>{t("Add")}</Button>
        </Modal>
        {editing ? (
          <Modal
            visible={itemVisible}
            onDismiss={hideItemModal}
            contentContainerStyle={containerStyle}>
            {getEditItem()}
          </Modal>
        ) : (
          <Modal
            visible={itemVisible}
            onDismiss={hideItemModal}
            contentContainerStyle={containerStyle}>
            {getItem()}
          </Modal>
        )}
      </Portal>
      <ScrollView>
        <View>{getItems()}</View>
      </ScrollView>
      <Button
        style={{marginVertical: 5}}
        onPress={() => {
          if (props.filter) {
            setDate(props.date);
          } else {
            setDate(new Date());
          }
          setMyName('');
          setMySubtitle('');
          showModal();
        }}>
        {t("New")}
      </Button>
    </Provider>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
});
