import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MessageResponse, SendMessageRequest, CreateGroupRequest, GroupResponse, AddMembersRequest, SendGroupMessageRequest } from '../models/chat.models';
import { LoaderService } from '../../core/services/loader.service';

@Injectable()
export class ChatService {
  private apiUrl = environment.apiUrl;
  private messagesSubject = new BehaviorSubject<MessageResponse[]>([]);
  private groupsSubject = new BehaviorSubject<GroupResponse[]>([]);
  private usersSubject = new BehaviorSubject<any[]>([]);

  messages$ = this.messagesSubject.asObservable();
  groups$ = this.groupsSubject.asObservable();
  users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient, private loaderService: LoaderService) {}

  getUsers(): Observable<any> {
    this.loaderService.show();
    return this.http.get<any>(`${this.apiUrl}/auth/users`).pipe(
      map(users => {
        this.usersSubject.next(users);
        this.loaderService.hide();
        return users;
      })
    );
  }

  getConversation(userId: number, page: number = 0): Observable<MessageResponse[]> {
    this.loaderService.show();
    return this.http.get<MessageResponse[]>(`${this.apiUrl}/messages/conversation/${userId}?page=${page}`).pipe(
      map(messages => {
        const current = this.messagesSubject.value;
        this.messagesSubject.next([...current, ...messages]);
        this.loaderService.hide();
        return messages;
      })
    );
  }

  sendMessage(request: SendMessageRequest): Observable<MessageResponse> {
    this.loaderService.show();
    return this.http.post<MessageResponse>(`${this.apiUrl}/messages/send`, request).pipe(
      map(message => {
        const current = this.messagesSubject.value;
        this.messagesSubject.next([...current, message]);
        this.loaderService.hide();
        return message;
      })
    );
  }

  createGroup(request: CreateGroupRequest): Observable<GroupResponse> {
    this.loaderService.show();
    return this.http.post<GroupResponse>(`${this.apiUrl}/groups`, request).pipe(
      map(group => {
        const current = this.groupsSubject.value;
        this.groupsSubject.next([...current, group]);
        this.loaderService.hide();
        return group;
      })
    );
  }

  addMembers(groupId: number, request: AddMembersRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/groups/${groupId}/members`, request);
  }

  getGroupMessages(groupId: number, page: number = 0): Observable<MessageResponse[]> {
    this.loaderService.show();
    return this.http.get<MessageResponse[]>(`${this.apiUrl}/groups/${groupId}/messages?page=${page}`).pipe(
      map(messages => {
        const current = this.messagesSubject.value;
        this.messagesSubject.next([...current, ...messages]);
        this.loaderService.hide();
        return messages;
      })
    );
  }

  sendGroupMessage(groupId: number, request: SendGroupMessageRequest): Observable<MessageResponse> {
    this.loaderService.show();
    return this.http.post<MessageResponse>(`${this.apiUrl}/groups/${groupId}/messages`, request).pipe(
      map(message => {
        const current = this.messagesSubject.value;
        this.messagesSubject.next([...current, message]);
        this.loaderService.hide();
        return message;
      })
    );
  }

  deleteMessage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/messages/${id}`);
  }

  deleteGroupMessage(groupId: number, messageId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/groups/${groupId}/messages/${messageId}`);
  }
}