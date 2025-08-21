import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  favorites: 'favorites_v1',
  settings: 'settings_v1',
} as const;

export async function setJsonItem<T>(key: string, value: T): Promise<void> {
  try {
    const json = JSON.stringify(value);
    await AsyncStorage.setItem(key, json);
  } catch (error) {
    // Swallow errors; persistence is best-effort
  }
}

export async function getJsonItem<T>(key: string): Promise<T | null> {
  try {
    const json = await AsyncStorage.getItem(key);
    if (!json) return null;
    return JSON.parse(json) as T;
  } catch (error) {
    return null;
  }
} 