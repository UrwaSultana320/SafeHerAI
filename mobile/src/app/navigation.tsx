import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import {
  ContactsScreen,
  SosScreen,
  ToolsScreen,
  AiScreen,
  HistoryScreen,
  ProfileScreen,
  SettingsScreen,
} from '../screens/FoundationScreens';
export type RootStackParamList = {
  Home: undefined;
  'Emergency Contacts': undefined;
  SOS: undefined;
  'Safety Tools': undefined;
  'AI Detection': undefined;
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
        <Stack.Screen name="AI Detection" component={AiScreen} />
        <Stack.Screen name="Emergency History" component={HistoryScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
