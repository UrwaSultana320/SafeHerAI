import React, { useState } from 'react';
import { Alert, Pressable, Switch, Text, TextInput, View } from 'react-native';
import { Page, styles } from '../components/Page';
import type { EmergencyContact } from '../models';
import { emergencyEngine, isValidPhoneNumber } from '../services';
import { localStorage } from '../storage';

const id = () => `contact-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
export function ContactsScreen() {
  const [contacts, setContacts] = useState(() => localStorage.read('contacts'));
  const [editingId, setEditingId] = useState<string>();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const persist = (next: EmergencyContact[]) => { localStorage.write('contacts', next); setContacts(next); };
  const reset = () => { setEditingId(undefined); setName(''); setPhone(''); setError(''); };
  const save = () => {
    if (!name.trim()) return setError('Enter a contact name.');
    if (!isValidPhoneNumber(phone)) return setError('Enter a valid phone number (7–20 digits).');
    const now = new Date().toISOString();
    if (editingId) {
      persist(contacts.map(item => item.id === editingId ? { ...item, name: name.trim(), phoneNumber: phone.trim(), updatedAt: now } : item));
    } else {
      persist([...contacts, { id: id(), name: name.trim(), phoneNumber: phone.trim(), priority: contacts.length + 1, enabled: true, createdAt: now, updatedAt: now }]);
    }
    reset();
  };
  const edit = (item: EmergencyContact) => { setEditingId(item.id); setName(item.name); setPhone(item.phoneNumber); setError(''); };
  return <Page title="Emergency Contacts">
    <Text style={styles.text}>Enabled contacts are placed in priority order in the emergency SMS composer.</Text>
    <TextInput accessibilityLabel="Contact name" style={styles.input} placeholder="Contact name" value={name} onChangeText={setName} />
    <TextInput accessibilityLabel="Phone number" style={styles.input} placeholder="Phone number" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
    {!!error && <Text style={styles.error}>{error}</Text>}
    <Pressable accessibilityRole="button" style={styles.button} onPress={save}><Text style={styles.buttonText}>{editingId ? 'Save changes' : 'Add contact'}</Text></Pressable>
    {editingId && <Pressable accessibilityRole="button" style={styles.card} onPress={reset}><Text style={styles.label}>Cancel editing</Text></Pressable>}
    {!contacts.length && <View style={styles.card}><Text style={styles.label}>No emergency contacts</Text><Text style={styles.muted}>Add at least one trusted person before using SOS.</Text></View>}
    {[...contacts].sort((a, b) => a.priority - b.priority).map(item => <View key={item.id} style={styles.card}>
      <Text style={styles.label}>{item.priority}. {item.name}</Text><Text style={styles.text}>{item.phoneNumber}</Text>
      <View style={styles.row}><Text style={styles.muted}>Enabled</Text><Switch value={item.enabled} onValueChange={enabled => persist(contacts.map(contact => contact.id === item.id ? { ...contact, enabled, updatedAt: new Date().toISOString() } : contact))} /></View>
      <View style={styles.row}>
        <Pressable accessibilityRole="button" style={styles.button} onPress={() => edit(item)}><Text style={styles.buttonText}>Edit</Text></Pressable>
        <Pressable accessibilityRole="button" style={[styles.button, styles.dangerButton]} onPress={() => Alert.alert('Delete contact?', item.name, [{ text: 'Cancel' }, { text: 'Delete', style: 'destructive', onPress: () => persist(contacts.filter(contact => contact.id !== item.id).map((contact, index) => ({ ...contact, priority: index + 1 }))) }])}><Text style={styles.buttonText}>Delete</Text></Pressable>
        <Pressable accessibilityRole="button" style={styles.card} onPress={() => persist(contacts.map(contact => contact.id === item.id ? { ...contact, priority: Math.max(1, contact.priority - 1) } : contact).sort((a,b) => a.priority-b.priority).map((contact,index) => ({...contact, priority:index+1})))}><Text style={styles.label}>Move up</Text></Pressable>
      </View>
    </View>)}
  </Page>;
}

export function SosScreen() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState('Press and hold for one second to prepare an emergency message.');
  const activate = async () => {
    if (busy) return;
    setBusy(true); setResult('Getting location and opening your SMS app…');
    const response = await emergencyEngine.start('sos_button');
    setResult(response.event.status === 'composer_opened' ? 'SMS composer opened. Review and send the message there.' : response.event.notesOptional || 'Emergency workflow could not open the SMS composer.');
    setBusy(false);
  };
  return <Page title="Emergency SOS">
    <Text style={styles.text}>SOS prepares a message for enabled emergency contacts. You must review and send it in your SMS app.</Text>
    <Pressable accessibilityRole="button" accessibilityLabel="Hold to activate SOS" delayLongPress={1000} disabled={busy} style={styles.sos} onLongPress={activate}><Text style={styles.sosText}>{busy ? 'WORKING…' : 'HOLD SOS'}</Text><Text style={styles.sosCaption}>Hold for 1 second</Text></Pressable>
    <View style={styles.card}><Text style={styles.text}>{result}</Text></View>
  </Page>;
}

export function HistoryScreen() {
  const [events, setEvents] = useState(() => localStorage.read('history'));
  return <Page title="Emergency History">
    <Pressable style={styles.card} onPress={() => setEvents(localStorage.read('history'))}><Text style={styles.label}>Refresh</Text></Pressable>
    {!events.length && <View style={styles.card}><Text style={styles.label}>No emergency events</Text><Text style={styles.muted}>SOS, shake, and AI escalations will appear here.</Text></View>}
    {events.map(event => <View key={event.id} style={styles.card}><Text style={styles.label}>{event.triggerSource.replaceAll('_', ' ')}</Text><Text style={styles.text}>{new Date(event.timestamp).toLocaleString()}</Text><Text style={styles.muted}>Status: {event.status.replaceAll('_', ' ')} · Contacts: {event.contactCount}</Text>{event.latitudeOptional !== undefined && <Text style={styles.muted}>{event.latitudeOptional.toFixed(5)}, {event.longitudeOptional?.toFixed(5)}</Text>}{event.notesOptional && <Text style={styles.error}>{event.notesOptional}</Text>}</View>)}
  </Page>;
}

export function ProfileScreen() {
  const stored = localStorage.read('profile');
  const [name, setName] = useState(stored?.name || ''); const [phone, setPhone] = useState(stored?.phoneNumber || ''); const [saved, setSaved] = useState(false);
  const save = () => { const now = new Date().toISOString(); localStorage.write('profile', { id: stored?.id || 'local-user', name: name.trim(), phoneNumber: phone.trim(), createdAt: stored?.createdAt || now, updatedAt: now }); setSaved(true); };
  return <Page title="Profile"><Text style={styles.text}>Your name is included in emergency messages.</Text><TextInput style={styles.input} placeholder="Your name" value={name} onChangeText={value => { setName(value); setSaved(false); }} /><TextInput style={styles.input} placeholder="Your phone (optional)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" /><Pressable style={styles.button} disabled={!name.trim()} onPress={save}><Text style={styles.buttonText}>Save profile</Text></Pressable>{saved && <Text style={styles.success}>Saved locally.</Text>}</Page>;
}
