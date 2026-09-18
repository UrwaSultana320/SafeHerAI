export type EmergencyTriggerSource =
  | 'sos_button'
  | 'shake'
  | 'ai_fall'
  | 'voice'
  | 'test';
export interface UserProfile {
  id: string;
  name: string;
  phoneNumber: string;
  optionalMedicalNote?: string;
  createdAt: string;
  updatedAt: string;
}
export interface EmergencyContact {
  id: string;
  name: string;
  phoneNumber: string;
  priority: number;
  relationshipOptional?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface AppSettings {
  protectionEnabled: boolean;
  shakeEnabled: boolean;
  aiDetectionEnabled: boolean;
  panicAlarmEnabled: boolean;
  recordingEnabled: boolean;
  countdownSeconds: number;
  autoEscalateEnabled: boolean;
  locationInEmergencyEnabled: boolean;
}
export type EmergencyStatus =
  | 'triggered'
  | 'awaiting_confirmation'
  | 'cancelled'
  | 'location_acquired'
  | 'location_unavailable'
  | 'composer_opened'
  | 'sent'
  | 'send_failed'
  | 'permission_denied'
  | 'completed';
export interface EmergencyEvent {
  id: string;
  triggerSource: EmergencyTriggerSource;
  timestamp: string;
  status: EmergencyStatus;
  latitudeOptional?: number;
  longitudeOptional?: number;
  locationAccuracyOptional?: number;
  smsMode: 'none' | 'composer' | 'direct';
  contactCount: number;
  aiClassOptional?: string;
  aiConfidenceOptional?: number;
  cancelledByUser: boolean;
  errorCodeOptional?: string;
  notesOptional?: string;
}
export interface SensorSample {
  timestamp: number;
  acc_x: number;
  acc_y: number;
  acc_z: number;
  gyro_x: number;
  gyro_y: number;
  gyro_z: number;
  session_id: string;
  activity_label: string;
}
export interface SensorSession {
  session_id: string;
  label: string;
  started_at: string;
  ended_at?: string;
  sample_rate_target: number;
  sample_count: number;
  device_model_optional?: string;
  notes_optional?: string;
  csv_path_optional?: string;
}
export interface RecordingReference { id: string; path: string; startedAt: string; endedAt: string; kind: 'audio' }
export interface FalseAlarmFeedback { id:string;timestamp:string;prediction:string;confidence:number;modelVersion:string;windowReference:string }
