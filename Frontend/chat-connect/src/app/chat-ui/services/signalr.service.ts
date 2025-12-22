import { Injectable, OnDestroy } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MessageResponse } from '../models/chat.models';
import { AuthService } from 'src/app/auth/services/auth.service';
import * as signalR from '@microsoft/signalr';

@Injectable()
export class SignalRService implements OnDestroy {
  private hubConnection: HubConnection | null = null;
  private messagesSubject = new BehaviorSubject<MessageResponse[]>([]);
  private onlineUsersSubject = new BehaviorSubject<number[]>([]);
  private typingUsersSubject = new BehaviorSubject<number[]>([]);

  messages$ = this.messagesSubject.asObservable();
  onlineUsers$ = this.onlineUsersSubject.asObservable();
  typingUsers$ = this.typingUsersSubject.asObservable();

  constructor(private authService: AuthService) {
    this.startConnection();
  }

  isConnected(): boolean {
  return this.hubConnection?.state === signalR.HubConnectionState.Connected;
}
  private startConnection(): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.signalRHubUrl, {
        accessTokenFactory: () => this.authService.getToken() || ''
      })
      .build();

    this.hubConnection.start().then(() => {
      console.log('SignalR connected');
      this.registerOnServerEvents();
    }).catch(err => console.error('SignalR connection error', err));

    this.hubConnection.onclose(() => {
      console.log('SignalR disconnected, reconnecting...');
      setTimeout(() => this.startConnection(), 5000);
    });
  }

  private registerOnServerEvents(): void {
    this.hubConnection?.on('ReceiveMessage', (message: MessageResponse) => {
      const current = this.messagesSubject.value;
      this.messagesSubject.next([...current, message]);
    });

    this.hubConnection?.on('UserOnline', (userId: number) => {
      const current = this.onlineUsersSubject.value;
      if (!current.includes(userId)) {
        this.onlineUsersSubject.next([...current, userId]);
      }
    });

    this.hubConnection?.on('UserOffline', (userId: number) => {
      const current = this.onlineUsersSubject.value;
      this.onlineUsersSubject.next(current.filter(id => id !== userId));
    });

    this.hubConnection?.on('Typing', (userId: number) => {
      const current = this.typingUsersSubject.value;
      if (!current.includes(userId)) {
        this.typingUsersSubject.next([...current, userId]);
      }
    });

    this.hubConnection?.on('StopTyping', (userId: number) => {
      const current = this.typingUsersSubject.value;
      this.typingUsersSubject.next(current.filter(id => id !== userId));
    });
  }

  sendPrivateMessage(message: MessageResponse): void {
    this.hubConnection?.invoke('SendPrivateMessage', message);
  }

  sendGroupMessage(message: MessageResponse): void {
    this.hubConnection?.invoke('SendGroupMessage', message);
  }

startTyping(): void {
  if (!this.isConnected()) return;
  this.hubConnection!.invoke('StartTyping', 0);
}

stopTyping(): void {
  if (!this.isConnected()) return;
  this.hubConnection!.invoke('StopTyping', 0);
}

  ngOnDestroy(): void {
    this.hubConnection?.stop();
  }
}