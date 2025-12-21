// Matching backend DTOs
export interface Message {
  id: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  content: string; // Text or base64 for image
  isImage: boolean;
  createdAt: string;
}

export interface Group {
  id: number;
  name: string;
  createdBy: number;
  createdAt: string;
  memberIds: number[];
}

export interface Chat {
  id: number;
  type: 'one-to-one' | 'group';
  name: string; // Username or group name
  lastMessage: Message | null;
  unreadCount: number;
  isOnline?: boolean; // For one-to-one
}

export interface SendMessageRequest {
  receiverId?: number;
  groupId?: number;
  content: string; // Text or base64
  isImage: boolean;
}

// NgRx state
export interface ChatState {
  chats: Chat[];
  selectedChat: Chat | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    hasMore: boolean;
  };
  typingUsers: Set<number>;
}

export const initialChatState: ChatState = {
  chats: [],
  selectedChat: null,
  messages: [],
  loading: false,
  error: null,
  pagination: { page: 0, hasMore: true },
  typingUsers: new Set()
};