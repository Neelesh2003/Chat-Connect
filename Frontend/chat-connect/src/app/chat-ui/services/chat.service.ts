import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';;
import { Message, Group, SendMessageRequest, Chat } from '../models/chat.models';
import { environment } from 'src/environments/environment.prod';

@Injectable()
export class ChatService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/auth/users`);
  }

  getChats(): Observable<Chat[]> {
    // Fetch recent chats; combine one-to-one and groups
    return this.http.get<Chat[]>(`${this.apiUrl}/chats`); // Assume backend endpoint
  }

  getMessages(chatId: number, page: number = 0): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/messages/conversation/${chatId}?page=${page}`);
  }

  sendMessage(request: SendMessageRequest): Observable<Message> {
    if (request.receiverId) {
      return this.http.post<Message>(`${this.apiUrl}/messages/send`, request);
    } else {
      return this.http.post<Message>(`${this.apiUrl}/groups/${request.groupId}/messages`, { message: request.content, isImage: request.isImage });
    }
  }

  createGroup(name: string, memberIds: number[]): Observable<Group> {
    return this.http.post<Group>(`${this.apiUrl}/groups`, { name, members: memberIds });
  }

  deleteMessage(messageId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/messages/${messageId}`);
  }
}