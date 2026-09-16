import { createLocalStorage, StringStore } from '../src/storage';
import { emergencyEngine, smsService } from '../src/services';
import { permissions } from '../src/permissions';

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
test('emergency, SMS and permissions remain inactive', async () => {
  expect((await emergencyEngine.start('sos_button')).status).toBe(
    'not_implemented',
  );
  expect((await smsService.openComposer()).status).toBe('not_implemented');
  expect(await permissions.requestForFeature('location')).toBe(
    'not_implemented',
  );
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
