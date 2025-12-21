import { createReducer, on } from '@ngrx/store';
import * as ChatActions from './chat.actions';
import { initialChatState, ChatState, Message } from '../models/chat.models';

export const chatReducer = createReducer(
  initialChatState,
  on(ChatActions.loadChatsSuccess, (state, { chats }) => ({ ...state, chats })),
  on(ChatActions.loadMessagesSuccess, (state, { messages, hasMore }) => ({
    ...state,
    messages: [...messages, ...state.messages], // Prepend for pagination
    pagination: { ...state.pagination, hasMore, page: state.pagination.page + 1 }
  })),
  on(ChatActions.sendMessageSuccess, (state, { message }) => ({
    ...state,
    messages: [...state.messages, message]
  })),
  on(ChatActions.selectChat, (state, { chat }) => ({ ...state, selectedChat: chat, messages: [] })),
  on(ChatActions.deleteMessage, (state, { messageId }) => ({
    ...state,
    messages: state.messages.filter(m => m.id !== messageId)
  })),
  on(ChatActions.chatFailure, (state, { error }) => ({ ...state, error }))
);