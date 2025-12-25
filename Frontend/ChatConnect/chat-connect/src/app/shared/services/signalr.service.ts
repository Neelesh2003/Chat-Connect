import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection | null = null;
  private connectionState = new BehaviorSubject<boolean>(false);
  
  public connectionState$ = this.connectionState.asObservable();

  constructor(private authService: AuthService) {}

  startConnection(): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      return Promise.reject('No auth token');
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.SIGNALR_HUB_URL, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    return this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR Connected');
        this.connectionState.next(true);
      })
      .catch((err) => {
        console.error('SignalR Connection Error:', err);
        this.connectionState.next(false);
        throw err;
      });
  }

  stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop().then(() => {
        console.log('SignalR Disconnected');
        this.connectionState.next(false);
      });
      this.hubConnection = null;
    }
  }

  on(methodName: string, callback: (...args: any[]) => void): void {
    if (this.hubConnection) {
      this.hubConnection.on(methodName, callback);
    }
  }

 off(methodName: string, callback?: (...args: any[]) => void): void {
  if (this.hubConnection) {
    if (callback) {
      this.hubConnection.off(methodName, callback);
    } else {
      this.hubConnection.off(methodName);
    }
  }
}

  invoke(methodName: string, ...args: any[]): Promise<any> {
    if (this.hubConnection) {
      return this.hubConnection.invoke(methodName, ...args);
    }
    return Promise.reject('No hub connection');
  }

  getConnectionState(): boolean {
    return this.hubConnection?.state === signalR.HubConnectionState.Connected;
  }
}