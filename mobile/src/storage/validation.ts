const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
export function isStoredValue(key: string, value: unknown): boolean {
  if (key === 'profile') {
    return (
      value === null ||
      (record(value) &&
        typeof value.id === 'string' &&
        typeof value.name === 'string' &&
        (value.medicalNote === undefined ||
          typeof value.medicalNote === 'string'))
    );
  }
  if (key === 'settings') {
    return (
      record(value) &&
      typeof value.countdownSeconds === 'number' &&
      Number.isFinite(value.countdownSeconds) &&
      value.countdownSeconds > 0 &&
      typeof value.autoEscalate === 'boolean'
    );
  }
  if (!Array.isArray(value)) {
    return false;
  }
  if (key === 'contacts') {
    return value.every(
      item =>
        record(item) &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.phone === 'string' &&
        typeof item.priority === 'number' &&
        Number.isFinite(item.priority),
    );
  }
  return (
    key === 'history' &&
    value.every(
      item =>
        record(item) &&
        typeof item.id === 'string' &&
        typeof item.createdAt === 'string' &&
        Number.isFinite(Date.parse(item.createdAt)) &&
        ['sos_button', 'shake', 'ai_fall', 'voice'].includes(
          String(item.source),
        ) &&
        ['triggered', 'cancelled', 'composer_opened', 'failed'].includes(
          String(item.status),
        ) &&
        (item.note === undefined || typeof item.note === 'string'),
    )
  );
}
