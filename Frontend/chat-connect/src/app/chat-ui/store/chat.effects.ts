import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { SignalRService } from '../services/signalr.service';
import { ChatService } from '../services/chat.service';
import * as ChatActions from './chat.actions';
import { ChatState } from '../models/chat.models';

@Injectable()
export class ChatEffects {
  constructor(
    private actions$: Actions,
    private chatService: ChatService,
    private signalRService: SignalRService,
    private store: Store<{ chat: ChatState }>
  ) {}

  loadChats$ = createEffect(() => this.actions$.pipe(
    ofType(ChatActions.loadChats),
    mergeMap(() => this.chatService.getChats().pipe(
      map(chats => ChatActions.loadChatsSuccess({ chats })),
      catchError(error => of(ChatActions.chatFailure({ error: error.message })))
    ))
  ));

  loadMessages$ = createEffect(() => this.actions$.pipe(
    ofType(ChatActions.loadMessages),
    mergeMap(({ chatId, page }) => this.chatService.getMessages(chatId, page).pipe(
      map(messages => ChatActions.loadMessagesSuccess({ messages, hasMore: messages.length === 20 })), // Assume page size 20
      catchError(error => of(ChatActions.chatFailure({ error: error.message })))
    ))
  ));

  sendMessage$ = createEffect(() => this.actions$.pipe(
    ofType(ChatActions.sendMessage),
    withLatestFrom(this.store.select('chat')),
    mergeMap(([{ request }, state]) => this.chatService.sendMessage(request).pipe(
      map(message => {
        this.signalRService.sendMessage(message); // Or sendGroupMessage
        return ChatActions.sendMessageSuccess({ message });
      }),
      catchError(error => of(ChatActions.chatFailure({ error: error.message })))
    ))
  ));

  // Listen to SignalR for real-time updates
  receiveMessage$ = createEffect(() => this.signalRService.messages$.pipe(
    map(messages => ChatActions.loadMessagesSuccess({ messages, hasMore: false })) // Append to state in reducer
  ));
}