import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient) {}

  getChatMessages(userId: number): Observable<any> {
    return this.http.get(`${environment.BASE_URL}/Messages/conversation/${userId}`);
  }

  sendMessage(receiverId: number, message: string): Observable<any> {
    return this.http.post(`${environment.BASE_URL}/Messages/send`, { receiverId, message });
  }
  sendImageMessage(formData: FormData) {
  return this.http.post(`${environment.BASE_URL}/Messages/send-image`, formData);
}

  deleteMessage(messageId: number): Observable<any> {
    return this.http.delete(`${environment.BASE_URL}/Messages/${messageId}`);
  }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${environment.BASE_URL}/upload`, formData);
  }

  getGroups(): Observable<any> {
    return this.http.get(`${environment.BASE_URL}/Groups`);
  }

  createGroup(name: string, members: number[]): Observable<any> {
    return this.http.post(`${environment.BASE_URL}/Groups`, { name, members });
  }

  getGroupMessages(groupId: number): Observable<any> {
    return this.http.get(`${environment.BASE_URL}/Groups/${groupId}/messages`);
  }

  sendGroupMessage(groupId: number, message: string): Observable<any> {
    return this.http.post(`${environment.BASE_URL}/Groups/${groupId}/messages`, { message });
  }

  deleteGroupMessage(groupId: number, msgId: number): Observable<any> {
    return this.http.delete(`${environment.BASE_URL}/Groups/${groupId}/messages/${msgId}`);
  }
}