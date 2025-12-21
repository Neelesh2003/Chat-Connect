import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { Message, Group } from '../models/chat.models';
import { environment } from 'src/environments/environment.prod';

@Injectable()
export class SignalRService {
  private hubConnection: HubConnection | null = null;
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  private onlineUsersSubject = new BehaviorSubject<Set<number>>(new Set());
  private typingSubject = new BehaviorSubject<Set<number>>(new Set());

  public messages$ = this.messagesSubject.asObservable();
  public onlineUsers$ = this.onlineUsersSubject.asObservable();
  public typing$ = this.typingSubject.asObservable();

  constructor(private authService: AuthService) {}

  public startConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(environment.signalRHubUrl, {
          accessTokenFactory: () => this.authService.getToken()!
        })
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build();

      this.hubConnection.start()
        .then(() => {
          console.log('SignalR Connected');
          this.registerEvents();
          resolve();
        })
        .catch(err => reject(err));
    });
  }

  private registerEvents(): void {
    this.hubConnection?.on('ReceiveMessage', (message: Message) => {
      this.messagesSubject.next([...this.messagesSubject.value, message]);
    });

    this.hubConnection?.on('UserOnline', (userId: number) => {
      const online = this.onlineUsersSubject.value;
      online.add(userId);
      this.onlineUsersSubject.next(online);
    });

    this.hubConnection?.on('UserOffline', (userId: number) => {
      const online = this.onlineUsersSubject.value;
      online.delete(userId);
      this.onlineUsersSubject.next(online);
    });

    this.hubConnection?.on('Typing', (userId: number) => {
      const typing = this.typingSubject.value;
      typing.add(userId);
      this.typingSubject.next(typing);
    });

    this.hubConnection?.on('StopTyping', (userId: number) => {
      const typing = this.typingSubject.value;
      typing.delete(userId);
      this.typingSubject.next(typing);
    });
  }

  public sendMessage(message: Message): void {
    this.hubConnection?.invoke('SendPrivateMessage', message);
  }

  public sendGroupMessage(groupMessage: Group): void {
    this.hubConnection?.invoke('SendGroupMessage', groupMessage);
  }

  public startTyping(chatId: number): void {
    this.hubConnection?.invoke('StartTyping', chatId);
  }

  public stopTyping(chatId: number): void {
    this.hubConnection?.invoke('StopTyping', chatId);
  }

  public stopConnection(): Promise<void> {
    return this.hubConnection?.stop() || Promise.resolve();
  }
}