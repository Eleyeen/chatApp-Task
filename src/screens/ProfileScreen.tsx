import React from 'react';
import { StyleSheet, Switch, View, Pressable } from 'react-native';
import { useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setNotificationsEnabled, setThemePreference } from '../store/settingsSlice';
import { useTheme } from '@react-navigation/native';
import TextComponent from '../component/global/TextComponent';

export default function ProfileScreen() {
  const systemScheme = useColorScheme();
  const dispatch = useDispatch();
  const { notificationsEnabled, themePreference } = useSelector((s: RootState) => s.settings);
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TextComponent style={[styles.title, { color: theme.colors.text }]}>Profile</TextComponent>

      <View style={styles.row}>
        <TextComponent style={[styles.label, { color: theme.colors.text }]}>Notifications</TextComponent>
        <Switch
          value={notificationsEnabled}
          onValueChange={(v) => {
            dispatch(setNotificationsEnabled(v));
          }}
        />
      </View>

      <View style={styles.section}>
        <TextComponent style={[styles.label, { color: theme.colors.text }]}>Theme</TextComponent>
        <View style={styles.rowBetween}>
          {(['system','light','dark'] as const).map((opt) => (
            <Pressable
              key={opt}
              onPress={() => dispatch(setThemePreference(opt))}
              style={[
                styles.chip,
                { borderColor: theme.colors.border },
                themePreference === opt && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
              ]}
            >
              <TextComponent style={[styles.chipText, { color: themePreference === opt ? 'white' : theme.colors.text }]}>
                {opt}
              </TextComponent>
            </Pressable>
          ))}
        </View>
      </View>

      <TextComponent style={[styles.helper, { color: theme.colors.text }]}>System theme: {systemScheme}</TextComponent>
      <TextComponent style={[styles.helper, { color: theme.colors.text }]}>Theme follows your selection.</TextComponent>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 },
  label: { fontSize: 16 },
  helper: { marginTop: 4 },
  section: { marginTop: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1 },
  chipText: { fontSize: 14 },
}); 