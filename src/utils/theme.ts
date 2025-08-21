import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';

export type ThemePreference = 'system' | 'light' | 'dark';

export function resolveTheme(pref: ThemePreference, isSystemDark: boolean): Theme {
  if (pref === 'light') return DefaultTheme;
  if (pref === 'dark') return DarkTheme;
  return isSystemDark ? DarkTheme : DefaultTheme;
} 