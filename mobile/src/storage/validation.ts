const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const date = (value: unknown) =>
  typeof value === 'string' && Number.isFinite(Date.parse(value));
const finite = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);
const optionalString = (value: unknown) =>
  value === undefined || typeof value === 'string';
const person = (value: Record<string, unknown>) =>
  typeof value.id === 'string' &&
  typeof value.name === 'string' &&
  typeof value.phoneNumber === 'string' &&
  date(value.createdAt) &&
  date(value.updatedAt);
export function isStoredValue(key: string, value: unknown): boolean {
  if (key === 'profile') {
    return (
      value === null ||
      (record(value) &&
        person(value) &&
        optionalString(value.optionalMedicalNote))
    );
  }
  if (key === 'settings') {
    return (
      record(value) &&
      finite(value.countdownSeconds) &&
      value.countdownSeconds > 0 &&
      [
        'protectionEnabled',
        'shakeEnabled',
        'aiDetectionEnabled',
        'panicAlarmEnabled',
        'recordingEnabled',
        'autoEscalateEnabled',
        'locationInEmergencyEnabled',
      ].every(field => typeof value[field] === 'boolean')
    );
  }
  if (!Array.isArray(value)) {
    return false;
  }
  if (key === 'contacts') {
    return value.every(
      item =>
        record(item) &&
        person(item) &&
        finite(item.priority) &&
        Number.isInteger(item.priority) &&
        item.priority >= 0 &&
        typeof item.enabled === 'boolean' &&
        optionalString(item.relationshipOptional),
    );
  }
  if (key === 'recordings') {
    return value.every(item => record(item) && typeof item.id === 'string' && typeof item.path === 'string' && item.kind === 'audio' && date(item.startedAt) && date(item.endedAt));
  }
  if (key === 'sensorSessions') {
    return value.every(item => record(item) && typeof item.session_id === 'string' && typeof item.label === 'string' && date(item.started_at) && (item.ended_at === undefined || date(item.ended_at)) && finite(item.sample_rate_target) && finite(item.sample_count) && optionalString(item.csv_path_optional) && optionalString(item.device_model_optional) && optionalString(item.notes_optional));
  }
  if (key === 'falseAlarmFeedback') {
    return value.every(item => record(item) && typeof item.id === 'string' && date(item.timestamp) && typeof item.prediction === 'string' && finite(item.confidence) && item.confidence >= 0 && item.confidence <= 1 && typeof item.modelVersion === 'string' && typeof item.windowReference === 'string');
  }
  return (
    key === 'history' &&
    value.every(
      item =>
        record(item) &&
        typeof item.id === 'string' &&
        date(item.timestamp) &&
        ['sos_button', 'shake', 'ai_fall', 'voice', 'test'].includes(
          String(item.triggerSource),
        ) &&
        [
          'triggered',
          'awaiting_confirmation',
          'cancelled',
          'location_acquired',
          'location_unavailable',
          'composer_opened',
          'sent',
          'send_failed',
          'permission_denied',
          'completed',
        ].includes(String(item.status)) &&
        ['none', 'composer', 'direct'].includes(String(item.smsMode)) &&
        finite(item.contactCount) &&
        Number.isInteger(item.contactCount) &&
        item.contactCount >= 0 &&
        typeof item.cancelledByUser === 'boolean' &&
        ['notesOptional', 'errorCodeOptional', 'aiClassOptional'].every(field =>
          optionalString(item[field]),
        ) &&
        (item.latitudeOptional === undefined ||
          (finite(item.latitudeOptional) &&
            Math.abs(item.latitudeOptional) <= 90)) &&
        (item.longitudeOptional === undefined ||
          (finite(item.longitudeOptional) &&
            Math.abs(item.longitudeOptional) <= 180)) &&
        (item.locationAccuracyOptional === undefined ||
          (finite(item.locationAccuracyOptional) &&
            item.locationAccuracyOptional >= 0)) &&
        (item.aiConfidenceOptional === undefined ||
          (finite(item.aiConfidenceOptional) &&
            item.aiConfidenceOptional >= 0 &&
            item.aiConfidenceOptional <= 1)),
    )
  );
}
