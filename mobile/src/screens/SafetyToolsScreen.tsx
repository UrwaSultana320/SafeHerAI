import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Page, styles } from '../components/Page';
import { deviceServices } from '../services/device';
import { permissions } from '../permissions';
import { emergencyEngine } from '../services';
import { localStorage } from '../storage';

type FakeCallState = 'idle' | 'waiting' | 'incoming' | 'connected';
export function ToolsScreen() {
  const [shakeOn, setShakeOn] = useState(false); const [countdown, setCountdown] = useState<number>();
  const [alarm, setAlarm] = useState(false); const [caller, setCaller] = useState('Amna'); const [delay, setDelay] = useState('5'); const [call, setCall] = useState<FakeCallState>('idle');
  const [recording, setRecording] = useState(false); const [recordingStart, setRecordingStart] = useState(''); const [message, setMessage] = useState('');
  const lastMagnitude = useRef(9.8); const lastShake = useRef(0); const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    if (!shakeOn) return;
    try {
      return deviceServices.subscribeSensors(event => {
        if (event.sensor !== 'accelerometer') return;
        const magnitude = Math.sqrt(event.x ** 2 + event.y ** 2 + event.z ** 2);
        const signal = Math.abs(magnitude - lastMagnitude.current); lastMagnitude.current = magnitude;
        if (signal > 15 && Date.now() - lastShake.current > 10_000) { lastShake.current = Date.now(); setCountdown(5); }
      });
    } catch (error) { setMessage(error instanceof Error ? error.message : String(error)); setShakeOn(false); }
  }, [shakeOn]);
  useEffect(() => {
    if (countdown === undefined) return;
    if (countdown <= 0) { setCountdown(undefined); void emergencyEngine.start('shake').then(result => setMessage(result.event.status.replaceAll('_', ' '))); return; }
    const handle = setTimeout(() => setCountdown(value => value === undefined ? undefined : value - 1), 1000); return () => clearTimeout(handle);
  }, [countdown]);
  useEffect(() => () => { deviceServices.stopAlarm(); if (timer.current) clearTimeout(timer.current); }, []);
  const toggleAlarm = () => { try { if (alarm) deviceServices.stopAlarm(); else deviceServices.startAlarm(); setAlarm(!alarm); } catch (error) { setMessage(error instanceof Error ? error.message : String(error)); } };
  const scheduleCall = () => { setCall('waiting'); timer.current = setTimeout(() => setCall('incoming'), Math.max(0, Number(delay) || 0) * 1000); };
  const toggleRecording = async () => {
    try {
      if (!recording) { if (await permissions.requestForFeature('microphone') !== 'granted') throw new Error('Microphone permission denied.'); const started = new Date().toISOString(); await deviceServices.startRecording(); setRecordingStart(started); setRecording(true); }
      else { const path = await deviceServices.stopRecording(); const endedAt = new Date().toISOString(); localStorage.write('recordings', [{ id: `audio-${Date.now()}`, path, startedAt: recordingStart, endedAt, kind: 'audio' }, ...localStorage.read('recordings')]); setRecording(false); setMessage(`Audio saved locally: ${path}`); }
    } catch (error) { setRecording(false); setMessage(error instanceof Error ? error.message : String(error)); }
  };
  if (call === 'incoming' || call === 'connected') return <Page title={call === 'incoming' ? 'Incoming call' : caller}><View style={styles.sos}><Text style={styles.sosText}>{caller}</Text><Text style={styles.sosCaption}>{call === 'incoming' ? 'SIMULATED INCOMING CALL' : 'SIMULATED CALL · 00:00'}</Text></View><View style={styles.row}>{call === 'incoming' && <Pressable style={styles.button} onPress={() => setCall('connected')}><Text style={styles.buttonText}>Accept</Text></Pressable>}<Pressable style={[styles.button, styles.dangerButton]} onPress={() => setCall('idle')}><Text style={styles.buttonText}>{call === 'incoming' ? 'Reject' : 'End call'}</Text></Pressable></View><Text style={styles.muted}>This is a local decoy screen, not a cellular call.</Text></Page>;
  return <Page title="Safety Tools">
    <View style={styles.card}><Text style={styles.label}>Shake trigger</Text><Text style={styles.muted}>Foreground accelerometer monitoring with a 10-second debounce.</Text><Pressable style={styles.button} onPress={() => setShakeOn(!shakeOn)}><Text style={styles.buttonText}>{shakeOn ? 'Stop shake monitoring' : 'Start shake monitoring'}</Text></Pressable>{countdown !== undefined && <><Text style={styles.error}>Shake detected · sending help in {countdown}s</Text><Pressable style={[styles.button, styles.dangerButton]} onPress={() => setCountdown(undefined)}><Text style={styles.buttonText}>I'M SAFE — CANCEL</Text></Pressable></>}</View>
    <View style={styles.card}><Text style={styles.label}>Panic alarm</Text><Text style={styles.muted}>Uses alarm audio and vibration. Do Not Disturb may limit sound.</Text><Pressable style={[styles.button, alarm && styles.dangerButton]} onPress={toggleAlarm}><Text style={styles.buttonText}>{alarm ? 'STOP ALARM' : 'Start loud alarm'}</Text></Pressable>{alarm && <Text style={styles.error}>ALARM ACTIVE</Text>}</View>
    <View style={styles.card}><Text style={styles.label}>Fake call</Text><TextInput style={styles.input} placeholder="Caller name" value={caller} onChangeText={setCaller} /><TextInput style={styles.input} placeholder="Delay seconds" keyboardType="number-pad" value={delay} onChangeText={setDelay} /><Pressable style={styles.button} onPress={scheduleCall}><Text style={styles.buttonText}>{call === 'waiting' ? 'Call scheduled…' : 'Schedule fake call'}</Text></Pressable><Text style={styles.muted}>Local simulation only; no cellular network is used.</Text></View>
    <View style={styles.card}><Text style={styles.label}>Audio evidence</Text><Text style={recording ? styles.error : styles.muted}>{recording ? '● REC — microphone active' : 'Recording is off.'}</Text><Pressable style={[styles.button, recording && styles.dangerButton]} onPress={toggleRecording}><Text style={styles.buttonText}>{recording ? 'Stop and save' : 'Start recording'}</Text></Pressable></View>
    {!!message && <Text style={styles.text}>{message}</Text>}
  </Page>;
}
