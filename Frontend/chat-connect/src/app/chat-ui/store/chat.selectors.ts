import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChatState } from '../models/chat.models';

export const selectChatState = createFeatureSelector<ChatState>('chat');

export const selectChats = createSelector(selectChatState, state => state.chats);

export const selectSelectedChat = createSelector(selectChatState, state => state.selectedChat);

export const selectMessages = createSelector(selectChatState, state => state.messages);

export const selectLoading = createSelector(selectChatState, state => state.loading);

export const selectHasMore = createSelector(selectChatState, state => state.pagination.hasMore);