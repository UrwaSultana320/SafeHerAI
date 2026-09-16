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
  first.write('profile', { id: 'test', name: 'Test User' });
  first.write('contacts', [
    { id: 'c', name: 'Test Contact', phone: '000', priority: 1 },
  ]);
  first.write('settings', { countdownSeconds: 20, autoEscalate: false });
  first.write('history', [
    {
      id: 'e',
      createdAt: '2026-09-15T00:00:00Z',
      source: 'sos_button',
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
