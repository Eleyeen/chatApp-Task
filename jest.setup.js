/* eslint-env jest */
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

jest.mock('@react-native-async-storage/async-storage', () => {
  let store = {};
  return {
    setItem: jest.fn(async (key, value) => { store[key] = value; }),
    getItem: jest.fn(async (key) => (key in store ? store[key] : null)),
    removeItem: jest.fn(async (key) => { delete store[key]; }),
    clear: jest.fn(async () => { store = {}; }),
  };
}); 