import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemePreference } from '../utils/theme';
import { getJsonItem, setJsonItem, STORAGE_KEYS } from '../utils/storage';

export interface SettingsState {
  themePreference: ThemePreference;
  notificationsEnabled: boolean;
}

const initialState: SettingsState = {
  themePreference: 'system',
  notificationsEnabled: true,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setThemePreference(state, action: PayloadAction<ThemePreference>) {
      state.themePreference = action.payload;
      setJsonItem(STORAGE_KEYS.settings, state);
    },
    setNotificationsEnabled(state, action: PayloadAction<boolean>) {
      state.notificationsEnabled = action.payload;
      setJsonItem(STORAGE_KEYS.settings, state);
    },
    hydrateSettings(state, action: PayloadAction<SettingsState>) {
      return action.payload;
    },
  },
});

export const { setThemePreference, setNotificationsEnabled, hydrateSettings } = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;

export async function loadSettings(
  dispatch: (action: PayloadAction<SettingsState>) => void
) {
  const saved = await getJsonItem<SettingsState>(STORAGE_KEYS.settings);
  if (saved) dispatch(hydrateSettings(saved));
} 