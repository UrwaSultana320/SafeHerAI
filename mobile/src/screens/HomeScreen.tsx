import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../app/navigation';
import { Page, styles } from '../components/Page';
export function HomeScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Home'>) {
  return (
    <Page title="SafeHer AI">
      <Text style={styles.text}>
        Intelligent Women Safety &amp; Emergency Response System
      </Text>
      <View style={styles.card}>
        <Text style={styles.label}>Emergency tools ready</Text>
        <Text style={styles.text}>
          SOS prepares a location-aware message in your SMS app. Sending remains under your control.
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open emergency SOS"
        style={styles.sos}
        onPress={() => navigation.navigate('SOS')}
      >
        <Text style={styles.sosText}>SOS</Text>
        <Text style={styles.sosCaption}>Open emergency control</Text>
      </Pressable>
      {(
        [
          'Emergency Contacts',
          'Safety Tools',
          'AI Detection',
          'Sensor Collection',
          'Emergency History',
          'Profile',
          'Settings',
        ] as const
      ).map(route => (
        <Pressable
          key={route}
          accessibilityLabel={route}
          accessibilityRole="button"
          style={styles.card}
          onPress={() => navigation.navigate(route)}
        >
          <Text style={styles.label}>{route} →</Text>
        </Pressable>
      ))}
    </Page>
  );
}
