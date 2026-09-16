import { createMMKV } from 'react-native-mmkv';
import { isStoredValue } from './validation';
import type {
  AppSettings,
  EmergencyContact,
  EmergencyEvent,
  UserProfile,
} from '../models';
interface Schema {
  profile: UserProfile | null;
  contacts: EmergencyContact[];
  settings: AppSettings;
  history: EmergencyEvent[];
}
export interface StringStore {
  getString(key: string): string | undefined;
  set(key: string, value: string): void;
}
const defaults: Schema = {
  profile: null,
  contacts: [],
  history: [],
  settings: {
    countdownSeconds: 15,
    autoEscalateEnabled: false,
    protectionEnabled: false,
    shakeEnabled: false,
    aiDetectionEnabled: false,
    panicAlarmEnabled: false,
    recordingEnabled: false,
    locationInEmergencyEnabled: false,
  },
};
export function createLocalStorage(backend: StringStore) {
  return {
    read<K extends keyof Schema>(key: K): Schema[K] {
      const raw = backend.getString('v1.' + key);
      if (raw === undefined) {
        return JSON.parse(JSON.stringify(defaults[key])) as Schema[K];
      }
      try {
        const parsed: unknown = JSON.parse(raw);
        if (!isStoredValue(key, parsed)) {
          throw new Error('Invalid stored shape');
        }
        return parsed as Schema[K];
      } catch {
        throw new Error(
          'Unable to read saved ' + key + '. Stored data has been preserved.',
        );
      }
    },
    write<K extends keyof Schema>(key: K, value: Schema[K]): void {
      if (!isStoredValue(key, value)) {
        throw new Error('Invalid ' + key + ' data');
      }
      backend.set('v1.' + key, JSON.stringify(value));
    },
  };
}
export const localStorage = createLocalStorage(
  createMMKV({ id: 'safeher.foundation' }),
);
