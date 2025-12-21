import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { selectSelectedChat, selectMessages, selectHasMore } from '../../store/chat.selectors';
import * as ChatActions from '../../store/chat.actions';
import { Message } from '../../models/chat.models';
import { TimestampPipe } from '../../../core/pipes/timestamp.pipe';

@Component({
  selector: 'app-chat-window',
  standalone: false,
  imports: [CommonModule, InfiniteScrollModule, TimestampPipe],
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit {
  selectedChat$: Observable<any>;
  messages$: Observable<Message[]>;
  hasMore$: Observable<boolean>;

  constructor(private store: Store) {
    this.selectedChat$ = this.store.select(selectSelectedChat);
    this.messages$ = this.store.select(selectMessages);
    this.hasMore$ = this.store.select(selectHasMore);
  }

  ngOnInit(): void {}

  onScroll(): void {
    this.store.dispatch(ChatActions.loadMessages({ 
      chatId: (this.selectedChat$ | async)?.id || 0, 
      page: 0 // Load older
    }));
  }

  onDeleteMessage(message: Message): void {
    this.store.dispatch(ChatActions.deleteMessage({ messageId: message.id }));
  }
}