// navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from '../screens/Dashboard';
import TrackingScreen from '../screens/TrackingScreen';
import HistoryScreen from '../screens/HistoryScreen';
import MedicineReminder from '../screens/MedicineReminder';

export type RootStackParamList = {
  Dashboard: undefined;
  Tracking: undefined;
  History: undefined;
  MedicineReminder:undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Tracking" component={TrackingScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="MedicineReminder" component={MedicineReminder} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
