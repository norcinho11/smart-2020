import React from "react";
import Screen from './Screen';

export const HomeScreen = ({navigation}) => <Screen navigation={navigation} name="Home" />
export const CalendarScreen = ({navigation}) => <Screen navigation={navigation} name="Calendar" />
export const NotesScreen = ({navigation}) => <Screen navigation={navigation} name="Notes" />
