import { configureStore } from '@reduxjs/toolkit';
import { chatsReducer } from './chatsSlice';
import { settingsReducer } from './settingsSlice';

export const store = configureStore({
  reducer: {
    chats: chatsReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 