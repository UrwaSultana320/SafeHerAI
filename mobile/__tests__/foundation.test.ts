import { createLocalStorage, StringStore } from '../src/storage';
import { buildEmergencyMessage, isValidPhoneNumber } from '../src/services';

test('profile, contacts, settings and history survive repository recreation', () => {
  const data = new Map<string, string>();
  const backend: StringStore = {
    getString: key => data.get(key),
    set: (key, value) => {
      data.set(key, value);
    },
  };
  const first = createLocalStorage(backend);
  first.write('profile', {
    id: 'test',
    name: 'Test User',
    phoneNumber: '000',
    createdAt: '2026-09-16T00:00:00Z',
    updatedAt: '2026-09-16T00:00:00Z',
  });
  first.write('contacts', [
    {
      id: 'c',
      name: 'Test Contact',
      phoneNumber: '000',
      priority: 1,
      enabled: true,
      createdAt: '2026-09-16T00:00:00Z',
      updatedAt: '2026-09-16T00:00:00Z',
    },
  ]);
  first.write('settings', { ...first.read('settings'), countdownSeconds: 20 });
  first.write('history', [
    {
      id: 'e',
      timestamp: '2026-09-15T00:00:00Z',
      triggerSource: 'sos_button',
      smsMode: 'none',
      contactCount: 0,
      cancelledByUser: true,
      status: 'cancelled',
    },
  ]);
  const second = createLocalStorage(backend);
  expect(second.read('profile')?.name).toBe('Test User');
  expect(second.read('contacts')).toHaveLength(1);
  expect(second.read('settings').countdownSeconds).toBe(20);
  expect(second.read('history')[0].status).toBe('cancelled');
});
test('corrupt data is reported and preserved', () => {
  const set = jest.fn();
  const storage = createLocalStorage({ getString: () => '{broken', set });
  expect(() => storage.read('profile')).toThrow('preserved');
  expect(set).not.toHaveBeenCalled();
});
test('emergency message includes identity, trigger, time and location', () => {
  const message = buildEmergencyMessage(
    { id: 'u', name: 'Ayesha', phoneNumber: '', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
    'sos_button', '2026-01-01T00:00:00Z', { latitude: 31.52, longitude: 74.35 },
  );
  expect(message).toContain('Ayesha'); expect(message).toContain('sos button'); expect(message).toContain('maps.google.com');
  expect(isValidPhoneNumber('+92 300 1234567')).toBe(true);
  expect(isValidPhoneNumber('12')).toBe(false);
});
test('valid JSON with an invalid schema is rejected without deleting it', () => {
  const set = jest.fn();
  const storage = createLocalStorage({
    getString: () => '{"countdownSeconds":"bad"}',
    set,
  });
  expect(() => storage.read('settings')).toThrow('preserved');
  expect(set).not.toHaveBeenCalled();
});

test('defaults keep all protection inactive and invalid writes never reach storage', () => {
  const set = jest.fn();
  const storage = createLocalStorage({ getString: () => undefined, set });
  const settings = storage.read('settings');
  expect(
    Object.entries(settings)
      .filter(([key]) => key.endsWith('Enabled'))
      .every(([, value]) => value === false),
  ).toBe(true);
  expect(() =>
    storage.write('settings', { ...settings, countdownSeconds: NaN }),
  ).toThrow('Invalid');
  expect(set).not.toHaveBeenCalled();
  settings.protectionEnabled = true;
  expect(storage.read('settings').protectionEnabled).toBe(false);
});
