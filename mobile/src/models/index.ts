export type EmergencyTriggerSource =
  | 'sos_button'
  | 'shake'
  | 'ai_fall'
  | 'voice';
export interface UserProfile {
  id: string;
  name: string;
  medicalNote?: string;
}
export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  priority: number;
}
export interface EmergencyEvent {
  id: string;
  createdAt: string;
  source: EmergencyTriggerSource;
  status: 'triggered' | 'cancelled' | 'composer_opened' | 'failed';
  note?: string;
}
export interface AppSettings {
  countdownSeconds: number;
  autoEscalate: boolean;
}
