/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, Theme } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './src/store/store';
import { resolveTheme } from './src/utils/theme';
import { loadSettings } from './src/store/settingsSlice';
import { RootState } from './src/store/store';

function AppInner() {
  const isDarkMode = useColorScheme() === 'dark';
  const themePreference = useSelector((s: RootState) => s.settings.themePreference);
  const dispatch = useDispatch();

  useEffect(() => {
    loadSettings(dispatch as any);
  }, [dispatch]);

  const theme: Theme = resolveTheme(themePreference, isDarkMode);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      <NavigationContainer theme={theme}>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}

export default App;
