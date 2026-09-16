import React from 'react';
import { Text } from 'react-native';
import { Page, styles } from '../components/Page';
import { localStorage } from '../storage';
function savedSummary(read: () => string): string {
  try {
    return read();
  } catch (error) {
    return error instanceof Error
      ? error.message
      : 'Local storage is unavailable.';
  }
}
export function ContactsScreen() {
  return (
    <Page title="Emergency Contacts">
      <Text style={styles.text}>
        {savedSummary(
          () =>
            localStorage.read('contacts').length +
            ' contacts saved. Contact management is planned.',
        )}
      </Text>
    </Page>
  );
}
export function SosScreen() {
  return (
    <Page title="SOS preview">
      <Text style={styles.text}>
        Emergency alerts are not available in this version. This screen does not
        send messages, obtain your location, or contact anyone.
      </Text>
      <Text style={styles.text}>
        In an emergency, use your phone to contact local emergency services.
      </Text>
    </Page>
  );
}
export function ToolsScreen() {
  return (
    <Page title="Safety Tools">
      <Text style={styles.text}>
        Panic alarm, fake call, and audio recording are planned. No tools are
        active.
      </Text>
    </Page>
  );
}
export function AiScreen() {
  return (
    <Page title="AI Detection">
      <Text style={styles.text}>
        Detection inactive. No sensor data is being collected and no model is
        running.
      </Text>
      <Text style={styles.text}>
        Future research uses safe, controlled simulated activities.
      </Text>
    </Page>
  );
}
export function HistoryScreen() {
  return (
    <Page title="Emergency History">
      <Text style={styles.text}>
        {savedSummary(
          () =>
            localStorage.read('history').length +
            ' events saved. This preview generates no emergency events.',
        )}
      </Text>
    </Page>
  );
}
export function ProfileScreen() {
  return (
    <Page title="Profile">
      <Text style={styles.text}>
        {savedSummary(
          () =>
            localStorage.read('profile')?.name ||
            'No profile saved. Profile editing is planned.',
        )}
      </Text>
    </Page>
  );
}
export function SettingsScreen() {
  return (
    <Page title="Settings">
      <Text style={styles.text}>
        {savedSummary(
          () =>
            'Future confirmation countdown: ' +
            localStorage.read('settings').countdownSeconds +
            ' seconds. Escalation is unavailable.',
        )}
      </Text>
      <Text style={styles.text}>
        Data stays on this device. No sensitive permissions are requested.
      </Text>
    </Page>
  );
}
