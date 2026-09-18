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
