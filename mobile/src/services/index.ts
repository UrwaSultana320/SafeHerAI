import { Linking, NativeModules, Platform } from 'react-native';
import type {
  EmergencyContact,
  EmergencyEvent,
  EmergencyTriggerSource,
  UserProfile,
} from '../models';
import { permissions } from '../permissions';
import { localStorage } from '../storage';

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}
export type LocationResult =
  | { status: 'available'; coordinates: Coordinates; source: 'last' | 'fresh' }
  | { status: 'permission_denied' | 'unavailable' | 'timeout'; message: string };
export interface EmergencyResult {
  event: EmergencyEvent;
  message: string;
}
const nativeLocation = NativeModules.SafeHerNative as
  | { getLocation(timeoutMs: number): Promise<Coordinates & { source: 'last' | 'fresh' }> }
  | undefined;
const newId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
export const isValidPhoneNumber = (value: string) =>
  /^\+?[0-9][0-9 ()-]{6,19}$/.test(value.trim());
export const mapsUrl = (coordinates: Coordinates) =>
  `https://maps.google.com/?q=${coordinates.latitude},${coordinates.longitude}`;
export function buildEmergencyMessage(
  profile: UserProfile | null,
  source: EmergencyTriggerSource,
  timestamp: string,
  coordinates?: Coordinates,
) {
  const who = profile?.name.trim() || 'A SafeHer AI user';
  const trigger = source.replaceAll('_', ' ');
  const location = coordinates
    ? `Location: ${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}\n${mapsUrl(coordinates)}`
    : 'Location unavailable.';
  return `EMERGENCY: ${who} may need help.\nTrigger: ${trigger}\nTime: ${timestamp}\n${location}`;
}
export interface EmergencyEngine {
  start(source: EmergencyTriggerSource): Promise<EmergencyResult>;
}
export interface LocationService {
  getCurrentLocation(timeoutMs?: number): Promise<LocationResult>;
}
export interface SmsService {
  openComposer(contacts: EmergencyContact[], message: string): Promise<void>;
}
export const locationService: LocationService = {
  getCurrentLocation: async (timeoutMs = 10000) => {
    const permission = await permissions.requestForFeature('location');
    if (permission !== 'granted') {
      return { status: 'permission_denied', message: 'Location permission denied.' };
    }
    if (!nativeLocation) {
      return { status: 'unavailable', message: 'Location service is unavailable.' };
    }
    try {
      const result = await nativeLocation.getLocation(timeoutMs);
      return { status: 'available', coordinates: result, source: result.source };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        status: message.toLowerCase().includes('timeout') ? 'timeout' : 'unavailable',
        message,
      };
    }
  },
};
export const smsService: SmsService = {
  openComposer: async (contacts, message) => {
    const recipients = contacts.map(item => item.phoneNumber.replace(/[^+\d]/g, '')).join(';');
    const separator = Platform.OS === 'ios' ? '&' : '?';
    const url = `sms:${recipients}${separator}body=${encodeURIComponent(message)}`;
    if (!(await Linking.canOpenURL(url))) throw new Error('No SMS application is available.');
    await Linking.openURL(url);
  },
};
export const emergencyEngine: EmergencyEngine = {
  start: async source => {
    const timestamp = new Date().toISOString();
    const contacts = localStorage
      .read('contacts')
      .filter(item => item.enabled && isValidPhoneNumber(item.phoneNumber))
      .sort((a, b) => a.priority - b.priority);
    const location = localStorage.read('settings').locationInEmergencyEnabled
      ? await locationService.getCurrentLocation()
      : { status: 'unavailable' as const, message: 'Location disabled in settings.' };
    const coordinates = location.status === 'available' ? location.coordinates : undefined;
    const message = buildEmergencyMessage(localStorage.read('profile'), source, timestamp, coordinates);
    const event: EmergencyEvent = {
      id: newId('event'), triggerSource: source, timestamp,
      status: location.status === 'permission_denied' ? 'permission_denied' : coordinates ? 'location_acquired' : 'location_unavailable',
      latitudeOptional: coordinates?.latitude, longitudeOptional: coordinates?.longitude,
      locationAccuracyOptional: coordinates?.accuracy, smsMode: 'none', contactCount: contacts.length,
      cancelledByUser: false,
      errorCodeOptional: location.status === 'available' ? undefined : location.status,
      notesOptional: location.status === 'available' ? undefined : location.message,
    };
    const save = () => localStorage.write('history', [event, ...localStorage.read('history')]);
    if (!contacts.length) {
      event.status = 'send_failed'; event.errorCodeOptional = 'no_contacts';
      event.notesOptional = 'No enabled contacts with valid phone numbers.'; save();
      return { event, message };
    }
    try {
      await smsService.openComposer(contacts, message);
      event.status = 'composer_opened'; event.smsMode = 'composer'; save();
    } catch (error) {
      event.status = 'send_failed'; event.errorCodeOptional = 'sms_unavailable';
      event.notesOptional = error instanceof Error ? error.message : String(error); save();
    }
    return { event, message };
  },
};
