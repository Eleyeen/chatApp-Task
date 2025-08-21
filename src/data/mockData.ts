import { Conversation, Message } from '../types/chat';

const lorem = [
  'Hey there! How are you?',
  "What's up?",
  'Are you joining the meeting later?',
  'Sounds good to me!',
  'See you soon!',
  'Can you send the file?',
  'On my way.',
  'Let’s catch up tomorrow.',
];

function createMessage(
  conversationId: string,
  text: string,
  sender: 'me' | 'other',
  timestamp: number,
  idx: number
): Message {
  return {
    id: `${conversationId}-${timestamp}-${idx}`,
    conversationId,
    text,
    timestamp,
    sender,
  };
}

export function generateMockConversations(): Conversation[] {
  const now = Date.now();
  const base: Array<Pick<Conversation, 'id' | 'title' | 'avatar'>> = [
    { id: '1', title: 'Afaq Ahmad', avatar: 'A' },
    { id: '2', title: 'Aans rahman', avatar: 'T' },
    { id: '3', title: 'Ali Ahmed', avatar: 'B' },
    { id: '4', title: 'Talha Shah', avatar: 'D' },
  ];

  return base.map((b, i) => {
    const messages: Message[] = [];
    for (let m = 0; m < 6; m++) {
      const ts = now - (i * 6 + m) * 60_000;
      const sender = m % 2 === 0 ? 'other' : 'me';
      messages.push(createMessage(b.id, lorem[(i + m) % lorem.length], sender, ts, m));
    }
    const lastMessage = messages[messages.length - 1];
    return {
      ...b,
      messages,
      lastMessage,
      unreadCount: i % 2,
    } as Conversation;
  });
}

export const randomIncomingTexts = [
  'Hello',
  'New update for you.',
  'Quick question...',
  'Are you around?',
  
]; 