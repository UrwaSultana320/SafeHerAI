import { NativeEventEmitter, NativeModules } from 'react-native';

export interface NativeSensorEvent { sensor: 'accelerometer' | 'gyroscope'; timestamp: number; x: number; y: number; z: number }
interface SafeHerNativeApi {
  startSensors(): void; stopSensors(): void; startAlarm(): void; stopAlarm(): void;
  startAudioRecording(): Promise<string>; stopAudioRecording(): Promise<string>;
  saveSensorCsv(fileName: string, content: string): Promise<string>; shareFile(path: string): Promise<boolean>;
  addListener(event: string): void; removeListeners(count: number): void;
}
const native = NativeModules.SafeHerNative as SafeHerNativeApi | undefined;
export const deviceServices = {
  subscribeSensors(listener: (event: NativeSensorEvent) => void) {
    if (!native) throw new Error('Sensor service is unavailable.');
    native.startSensors(); const subscription = new NativeEventEmitter(native).addListener('SafeHerSensor', event => listener(event as unknown as NativeSensorEvent));
    return () => { subscription.remove(); native.stopSensors(); };
  },
  startAlarm() { if (!native) throw new Error('Alarm service is unavailable.'); native.startAlarm(); },
  stopAlarm() { native?.stopAlarm(); },
  startRecording() { if (!native) throw new Error('Recording service is unavailable.'); return native.startAudioRecording(); },
  stopRecording() { if (!native) throw new Error('Recording service is unavailable.'); return native.stopAudioRecording(); },
  saveCsv(fileName: string, content: string) { if (!native) throw new Error('File service is unavailable.'); return native.saveSensorCsv(fileName, content); },
  shareFile(path: string) { if (!native) throw new Error('Share service is unavailable.'); return native.shareFile(path); },
};
