// Jest cannot load Android native storage; integration on a device remains a separate check.
/* global jest */
jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);
jest.mock('react-native-mmkv', () => ({
  createMMKV: () => {
    const values = new Map();
    return {
      getString: key => values.get(key),
      set: (key, value) => values.set(key, value),
    };
  },
}));
