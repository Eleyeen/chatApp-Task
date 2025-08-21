export type MessageSender = 'me' | 'other';

export interface Message {
  id: string;
  conversationId: string;
  text: string;
  timestamp: number;
  sender: MessageSender;
}

export interface Conversation {
  id: string;
  title: string;
  avatar?: string;
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
} 