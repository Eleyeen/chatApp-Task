import React, { useEffect, useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { toggleFavorite, loadFavorites, sendMessage, setTyping } from '../store/chatsSlice';
import type { Conversation } from '../types/chat';
import { randomIncomingTexts } from '../data/mockData';
import TextComponent from '../component/global/TextComponent';

export default function ChatsScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { conversations, favoriteConversationIds, typingConversationIds } = useSelector(
    (s: RootState) => s.chats
  );
  const notificationsEnabled = useSelector((s: RootState) => s.settings.notificationsEnabled);

  useEffect(() => {
    loadFavorites(dispatch as any);
  }, [dispatch]);

  useEffect(() => {
    if (!notificationsEnabled || conversations.length === 0) return;
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * conversations.length);
      const conv = conversations[idx];
      if (!conv) return;
      dispatch(setTyping({ conversationId: conv.id, typing: true }));
      setTimeout(() => {
        const text = randomIncomingTexts[Math.floor(Math.random() * randomIncomingTexts.length)];
        dispatch(sendMessage({ conversationId: conv.id, text, sender: 'other' }));
        dispatch(setTyping({ conversationId: conv.id, typing: false }));
      }, 1200);
    }, 15000);
    return () => clearInterval(interval);
  }, [notificationsEnabled, conversations, dispatch]);

  const data = useMemo(() => {
    return conversations.slice().sort((a, b) => (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0));
  }, [conversations]);

  function renderItem({ item }: { item: Conversation }) {
    const isFavorite = favoriteConversationIds.includes(item.id);
    const isTyping = typingConversationIds.includes(item.id);
    return (
      <Pressable
        onPress={() => navigation.navigate('Chat', { conversationId: item.id })}
        style={styles.row}
      >
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <TextComponent style={styles.avatarText}>{item.avatar || item.title[0]}</TextComponent>
        </View>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <TextComponent style={[styles.title, { color: colors.text }]}>{item.title}</TextComponent>
            {!!item.unreadCount && (
              <View style={[styles.badge, { backgroundColor: '#ef4444' }]}>
                <TextComponent style={styles.badgeText}>{item.unreadCount}</TextComponent>
              </View>
            )}
          </View>
          <TextComponent style={[styles.subtitle, { color: colors.text }]} numberOfLines={1}>
            {isTyping ? 'Typing…' : item.lastMessage?.text || 'No messages yet'}
          </TextComponent>
        </View>
        <Pressable onPress={() => dispatch(toggleFavorite(item.id))} style={styles.favBtn} hitSlop={12}>
          <TextComponent style={[styles.favText, { color: isFavorite ? '#f59e0b' : '#9ca3af' }]}>★</TextComponent>
        </Pressable>
      </Pressable>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.border }]} />}
      contentContainerStyle={styles.list}
      style={{ backgroundColor: colors.background }}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    marginHorizontal: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {},
  separator: {
    height: StyleSheet.hairlineWidth,
  },
  favBtn: {
    padding: 4,
  },
  favText: {
    fontSize: 20,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
}); 