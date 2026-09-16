import type { EmergencyTriggerSource } from '../models';
export type Unavailable = { status: 'not_implemented'; message: string };
const unavailable = async (): Promise<Unavailable> => ({
  status: 'not_implemented',
  message: 'Unavailable in Milestone 1.',
});
export interface EmergencyEngine {
  start(source: EmergencyTriggerSource): Promise<Unavailable>;
}
export interface LocationService {
  getCurrentLocation(): Promise<Unavailable>;
}
export interface SmsService {
  openComposer(): Promise<Unavailable>;
}
export interface SensorService {
  startCollection(): Promise<Unavailable>;
}
export interface RecordingService {
  startRecording(): Promise<Unavailable>;
}
export interface AiInferenceService {
  predict(): Promise<Unavailable>;
}
// Inactive adapters have no platform API calls or side effects.
export const emergencyEngine: EmergencyEngine = { start: unavailable };
export const locationService: LocationService = {
  getCurrentLocation: unavailable,
};
export const smsService: SmsService = { openComposer: unavailable };
export const sensorService: SensorService = { startCollection: unavailable };
export const recordingService: RecordingService = {
  startRecording: unavailable,
};
export const aiInferenceService: AiInferenceService = { predict: unavailable };
