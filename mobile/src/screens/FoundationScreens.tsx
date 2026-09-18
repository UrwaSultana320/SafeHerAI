import React, { useState } from 'react';
import { Pressable, Switch, Text, TextInput, View } from 'react-native';
import { Page, styles } from '../components/Page';
import { localStorage } from '../storage';
export function SettingsScreen() {
  const [settings, setSettings] = useState(() => localStorage.read('settings'));
  const [countdown, setCountdown] = useState(String(settings.countdownSeconds));
  const [saved, setSaved] = useState(false);
  const save = () => {
    const seconds = Math.max(5, Math.min(60, Number(countdown) || 15));
    const next = { ...settings, countdownSeconds: seconds };
    localStorage.write('settings', next); setSettings(next); setCountdown(String(seconds)); setSaved(true);
  };
  return (
    <Page title="Settings">
      <View style={styles.card}><Text style={styles.label}>Fall confirmation countdown</Text><TextInput accessibilityLabel="Countdown seconds" style={styles.input} keyboardType="number-pad" value={countdown} onChangeText={value => { setCountdown(value); setSaved(false); }} /><Text style={styles.muted}>5–60 seconds before automatic escalation.</Text></View>
      <View style={styles.card}><View style={styles.row}><Text style={styles.label}>Include location in emergencies</Text><Switch value={settings.locationInEmergencyEnabled} onValueChange={value => { setSettings(current => ({ ...current, locationInEmergencyEnabled: value })); setSaved(false); }} /></View><Text style={styles.muted}>Location permission is requested only during an emergency workflow.</Text></View>
      <Pressable accessibilityRole="button" style={styles.button} onPress={save}><Text style={styles.buttonText}>Save settings</Text></Pressable>
      {saved && <Text style={styles.success}>Settings saved locally.</Text>}
      <Text style={styles.text}>Contacts, history, sensor sessions, recordings, and feedback stay in app-private storage unless you explicitly share or send them.</Text>
    </Page>
  );
}
