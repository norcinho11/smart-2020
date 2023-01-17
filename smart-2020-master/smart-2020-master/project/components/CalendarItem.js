import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Header, ListItem} from 'react-native-elements';
import Icon from 'react-native-elements';
import colors from './colors';
import {Modal, Portal, Button, Provider, TextInput} from 'react-native-paper';
import {useCardAnimation} from '@react-navigation/stack';
import firestore from '@react-native-firebase/firestore';
import {useTranslation} from 'react-i18next';

var _ = require('lodash');

import {ActivityIndicator} from 'react-native';

export default function CalendarItem(props) {
  
  const [list, changeList] = useState([]);
  const {t, i18n} = useTranslation(['translation']);

  useEffect(() => {
    const subscriber = firestore()
      .collection('DailyTodo')
      .where('userId', '==', props.user.id)
      .onSnapshot((querySnapshot) => {
        const notes = [];

        querySnapshot.forEach((documentSnapshot) => {
          notes.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
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
      notes.push({
        ...documentSnapshot.data(),
        key: documentSnapshot.id,
      });
    });

    if (!_.isEqual(list, notes)) {
      changeList(notes);
    }
  }

  function onError(error) {
    console.error(error);
  }

  firestore().collection('DailyTodo').onSnapshot(onResult, onError);

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
        <Button
          onPress={() => {
            setEditing(true);
            let item = list.find((item) => item.id == currentItem);
            if (item == null) {
              hideItemModal();
              return;
            }
            setEditName(item.name);
            setEditSubtitle(item.subtitle);
          }}>
          {t(Edit)}
        </Button>
        <Button onPress={deleteItem}>Delete</Button>
      </View>
    );
  };

  const getEditItem = () => {
    // if (!itemVisible) return;

    return (
      <View>
        <View>
          <TextInput
            value={editName}
            label={t("Name")}
            onChangeText={(text) => setEditName(text)}
          />
          <TextInput
            value={editSubtitle}
            label={t("Subtitle")}
            onChangeText={(text) => setEditSubtitle(text)}
          />
        </View>
        <Button style={{marginTop: 10}} onPress={() => saveChange(currentItem)}>
          {t(Save)}
        </Button>
      </View>
    );
  };

  const saveChange = (id) => {
    const document = list.find((item) => item.id == id);

    if (document != null)
      firestore()
        .collection('DailyTodo')
        .doc(document.key)
        .update({name: editName, subtitle: editSubtitle});
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
      .collection('DailyTodo')
      .add({
        name: myName,
        subtitle: mySubtitle,
        id: `${myName}_${Date().toString()}`,
        user: props.user.id,
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

  const deleteItem = () => {
    // let tempList = [...list]; //vytvorim kopiu
    // tempList = tempList.filter(function (item) {
    //   return item.id != currentItem;
    // });
    // changeList(tempList);
    const document = list.find((item) => item.id == currentItem);
    firestore()
      .collection('DailyTodo')
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
    <Provider>
      <Portal>
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
            label={t("Subtitle")}
            value={mySubtitle}
            onChangeText={(text) => setMySubtitle(text)}
          />
          <Button onPress={addListItem}>{t(Add)}</Button>
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
          setMyName('');
          setMySubtitle('');
          showModal();
        }}>
        {t(New)}
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


