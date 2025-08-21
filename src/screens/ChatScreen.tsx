import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useRoute, useNavigation, useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { markRead, sendMessage, setTyping } from '../store/chatsSlice';
import TextComponent from '../component/global/TextComponent';

export default function ChatScreen() {
  const route = useRoute<any>();
  const { conversationId } = route.params as { conversationId: string };
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const { colors, dark } = useTheme();
  const { conversations, typingConversationIds } = useSelector((s: RootState) => s.chats);
  const conversation = useMemo(() => conversations.find(c => c.id === conversationId), [conversations, conversationId]);
  const [text, setText] = useState('');
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (conversation) {
      navigation.setOptions({ title: conversation.title });
      dispatch(markRead({ conversationId }));
    }
  }, [conversation, conversationId, dispatch, navigation]);

  const isTyping = typingConversationIds.includes(conversationId);

  function onSend() {
    if (!text.trim()) return;
    dispatch(sendMessage({ conversationId, text: text.trim() }));
    setText('');
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  }

  if (!conversation) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}> 
        <TextComponent style={{ color: colors.text }}>Conversation not found</TextComponent>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
      keyboardVerticalOffset={80}
    >
      <FlatList
        ref={listRef}
        data={conversation.messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.bubble,
            item.sender === 'me' ? { alignSelf: 'flex-end', backgroundColor: colors.primary } : { alignSelf: 'flex-start', backgroundColor: dark ? '#27272a' : '#f3f4f6' }
          ]}>
            <TextComponent style={[styles.bubbleText, { color: item.sender === 'me' ? 'white' : colors.text }]}>{item.text}</TextComponent>
          </View>
        )}
        contentContainerStyle={styles.messages}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      />
      {isTyping && (
        <View style={styles.typing}><TextComponent style={[styles.typingText, { color: colors.text }]}>Typing…</TextComponent></View>
      )}
      <View style={[styles.inputRow, { borderTopColor: colors.border, backgroundColor: colors.card }]}>
        <TextInput
          placeholder="Type a message"
          placeholderTextColor={dark ? '#9ca3af' : '#6b7280'}
          value={text}
          onChangeText={(t) => {
            setText(t);
            dispatch(setTyping({ conversationId, typing: t.length > 0 }));
          }}
          style={[styles.input, { backgroundColor: dark ? '#111827' : '#f9fafb', color: colors.text }]}
          onBlur={() => dispatch(setTyping({ conversationId, typing: false }) )}
        />
        <Pressable onPress={onSend} style={[styles.sendBtn, { backgroundColor: colors.primary }]}>
          <TextComponent style={styles.sendText}>Send</TextComponent>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  messages: { padding: 12 },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginVertical: 4,
  },
  bubbleText: { fontSize: 16 },
  typing: { paddingHorizontal: 16, paddingBottom: 4 },
  typingText: {},
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: { flex: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  sendBtn: { marginLeft: 8, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16 },
  sendText: { color: 'white', fontWeight: '600' },
}); 