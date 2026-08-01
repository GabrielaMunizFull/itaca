/**
 * Setup global de testes — Ãtaca App
 *
 * Mocks de módulos nativos que não existem no ambiente Jest (AsyncStorage,
 * safe-area-context), aplicados a toda a suíte.
 */

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-safe-area-context', () => {
  const mock = require('react-native-safe-area-context/jest/mock');
  return mock.default ?? mock;
});
