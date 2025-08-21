import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { Conversation, Message } from '../types/chat';
import { generateMockConversations } from '../data/mockData';
import { getJsonItem, setJsonItem, STORAGE_KEYS } from '../utils/storage';

export interface ChatsState {
  conversations: Conversation[];
  favoriteConversationIds: string[];
  typingConversationIds: string[];
  onlineConversationIds: string[];
}

const initialState: ChatsState = {
  conversations: generateMockConversations(),
  favoriteConversationIds: [],
  typingConversationIds: [],
  onlineConversationIds: [],
};

export const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setFavorites(state, action: PayloadAction<string[]>) {
      state.favoriteConversationIds = action.payload;
    },
    toggleFavorite(state, action: PayloadAction<string>) {
      const id = action.payload;
      const exists = state.favoriteConversationIds.includes(id);
      state.favoriteConversationIds = exists
        ? state.favoriteConversationIds.filter(x => x !== id)
        : [...state.favoriteConversationIds, id];
      setJsonItem(STORAGE_KEYS.favorites, state.favoriteConversationIds);
    },
    sendMessage(
      state,
      action: PayloadAction<{ conversationId: string; text: string; sender?: 'me' | 'other' }>
    ) {
      const { conversationId, text, sender = 'me' } = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      if (!conversation) return;
      const message: Message = {
        id: nanoid(),
        conversationId,
        text,
        timestamp: Date.now(),
        sender,
      };
      conversation.messages.push(message);
      conversation.lastMessage = message;
      if (sender === 'other') {
        conversation.unreadCount += 1;
      }
    },
    markRead(state, action: PayloadAction<{ conversationId: string }>) {
      const { conversationId } = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.unreadCount = 0;
      }
    },
    setTyping(state, action: PayloadAction<{ conversationId: string; typing: boolean }>) {
      const { conversationId, typing } = action.payload;
      const set = new Set(state.typingConversationIds);
      if (typing) set.add(conversationId);
      else set.delete(conversationId);
      state.typingConversationIds = Array.from(set);
    },
    setOnline(state, action: PayloadAction<{ conversationId: string; online: boolean }>) {
      const { conversationId, online } = action.payload;
      const set = new Set(state.onlineConversationIds);
      if (online) set.add(conversationId);
      else set.delete(conversationId);
      state.onlineConversationIds = Array.from(set);
    },
  },
});

export const {
  setFavorites,
  toggleFavorite,
  sendMessage,
  markRead,
  setTyping,
  setOnline,
} = chatsSlice.actions;

export const chatsReducer = chatsSlice.reducer;

// Async initializer to load favorites from storage
export async function loadFavorites(dispatch: (action: PayloadAction<string[]>) => void) {
  const saved = await getJsonItem<string[]>(STORAGE_KEYS.favorites);
  if (saved) dispatch(setFavorites(saved));
} 