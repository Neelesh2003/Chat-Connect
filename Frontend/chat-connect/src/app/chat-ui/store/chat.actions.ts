import { createAction, props } from '@ngrx/store';
import { Message, Chat, SendMessageRequest } from '../models/chat.models';

export const loadChats = createAction('[Chat] Load Chats');
export const loadChatsSuccess = createAction('[Chat] Load Chats Success', props<{ chats: Chat[] }>());
export const loadMessages = createAction('[Chat] Load Messages', props<{ chatId: number; page: number }>());
export const loadMessagesSuccess = createAction('[Chat] Load Messages Success', props<{ messages: Message[]; hasMore: boolean }>());
export const sendMessage = createAction('[Chat] Send Message', props<{ request: SendMessageRequest }>());
export const sendMessageSuccess = createAction('[Chat] Send Message Success', props<{ message: Message }>());
export const selectChat = createAction('[Chat] Select Chat', props<{ chat: Chat }>());
export const deleteMessage = createAction('[Chat] Delete Message', props<{ messageId: number }>());
export const chatFailure = createAction('[Chat] Failure', props<{ error: string }>());