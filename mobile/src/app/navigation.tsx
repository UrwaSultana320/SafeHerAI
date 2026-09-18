import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import {
  SettingsScreen,
} from '../screens/FoundationScreens';
import { ContactsScreen, SosScreen, HistoryScreen, ProfileScreen } from '../screens/EmergencyScreens';
import { ToolsScreen } from '../screens/SafetyToolsScreen';
import { SensorCollectionScreen } from '../screens/SensorCollectionScreen';
import { AiDetectionScreen } from '../screens/AiDetectionScreen';
export type RootStackParamList = {
  Home: undefined;
  'Emergency Contacts': undefined;
  SOS: undefined;
  'Safety Tools': undefined;
  'AI Detection': undefined;
  'Sensor Collection': undefined;
  'Emergency History': undefined;
  Profile: undefined;
  Settings: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();
export function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: '#392D62',
          contentStyle: { backgroundColor: '#F7F7FB' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Emergency Contacts" component={ContactsScreen} />
        <Stack.Screen name="SOS" component={SosScreen} />
        <Stack.Screen name="Safety Tools" component={ToolsScreen} />
        <Stack.Screen name="AI Detection" component={AiDetectionScreen} />
        <Stack.Screen name="Sensor Collection" component={SensorCollectionScreen} />
        <Stack.Screen name="Emergency History" component={HistoryScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
