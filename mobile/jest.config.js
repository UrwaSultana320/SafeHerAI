module.exports = {
  setupFilesAfterEnv: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native/|react-native[^/]*|@react-navigation/))',
  ],
  preset: '@react-native/jest-preset',
};
