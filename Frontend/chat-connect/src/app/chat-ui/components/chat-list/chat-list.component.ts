import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { selectChats, selectSelectedChat } from '../../store/chat.selectors';
import * as ChatActions from '../../store/chat.actions';
import { Chat } from '../../models/chat.models';

@Component({
  selector: 'app-chat-list',
  standalone: false,
  imports: [CommonModule],
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  chats$: Observable<Chat[]>;
  selectedChat$: Observable<Chat | null>;

  constructor(private store: Store) {
    this.chats$ = this.store.select(selectChats);
    this.selectedChat$ = this.store.select(selectSelectedChat);
  }

  ngOnInit(): void {
    this.store.dispatch(ChatActions.loadChats());
  }

  onSelectChat(chat: Chat): void {
    this.store.dispatch(ChatActions.selectChat({ chat }));
    this.store.dispatch(ChatActions.loadMessages({ chatId: chat.id, page: 0 }));
  }
}