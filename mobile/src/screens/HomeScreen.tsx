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
        <Text style={styles.label}>Protection inactive</Text>
        <Text style={styles.text}>
          Foundation preview. Monitoring and emergency alerts are not available
          yet.
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="SOS preview. Does not send alerts"
        style={styles.sos}
        onPress={() => navigation.navigate('SOS')}
      >
        <Text style={styles.sosText}>SOS</Text>
        <Text style={styles.sosCaption}>Preview only</Text>
      </Pressable>
      {(
        [
          'Emergency Contacts',
          'Safety Tools',
          'AI Detection',
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
