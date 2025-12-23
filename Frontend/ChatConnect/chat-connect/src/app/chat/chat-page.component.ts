import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { AuthService } from '../shared/services/auth.service';
import { ChatService } from '../shared/services/chat.service';
import { LoaderService } from '../shared/services/loader.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateGroupDialogComponent } from './components/create-group-dialog/create-group-dialog.component';
import { environment } from 'src/environments/environment';

interface SendMessageEvent {
  receiverId?: number;
  groupId?: number;
  message: string;
  isImage?: boolean;
}

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
  // Removed standalone: false and imports[] - handled by NgModule
})
export class ChatPageComponent implements OnInit, OnDestroy {
  userName: string | null = null;
  users: any[] = [];
  groups: any[] = [];
  selectedUser: any = null;
  selectedGroup: any = null;
  messages: any[] = [];
  onlineUsers = new Map<number, boolean>();

  private hubConnection: signalR.HubConnection | null = null;
  private pollIntervalId: any = null;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router,
    private loaderService: LoaderService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.userName = currentUser.username;
    this.loadUsers();
    this.loadGroups();
    this.startSignalR();
  }

  ngOnDestroy(): void {
    this.stopSignalR();
    this.clearPolling();
  }

  loadUsers(): void {
    this.authService.getUsers().subscribe({
      next: (users) => {
        this.users = users.filter((u: any) => u.id !== this.authService.getCurrentUser()?.userId);
        this.updateOnlineStatuses();
      },
      error: () => alert('Error loading users')
    });
  }

  loadGroups(): void {
    this.chatService.getGroups().subscribe({
      next: (groups) => this.groups = groups,
      error: () => alert('Error loading groups')
    });
  }

  onSelectUser(user: any): void {
    this.selectedUser = user;
    this.selectedGroup = null;
    this.messages = [];
    this.fetchUserMessages(user.id);
    this.startPolling();
  }

  onSelectGroup(group: any): void {
    this.selectedGroup = group;
    this.selectedUser = null;
    this.messages = [];
    this.fetchGroupMessages(group.id);
    this.startPolling();
  }

  onSendMessage(event: SendMessageEvent): void { // Explicit type for TS2345 fix
    if (event.receiverId) {
      this.chatService.sendMessage(event.receiverId, event.message).subscribe({
        next: () => this.fetchUserMessages(event.receiverId!),
        error: () => alert('Error sending message')
      });
    } else if (event.groupId) {
      this.chatService.sendGroupMessage(event.groupId, event.message).subscribe({
        next: () => this.fetchGroupMessages(event.groupId!),
        error: () => alert('Error sending group message')
      });
    }
  }

  onDeleteMessage(msg: any): void {
    if (this.selectedUser) {
      this.chatService.deleteMessage(msg.id).subscribe({
        next: () => this.messages = this.messages.filter(m => m.id !== msg.id),
        error: () => alert('Error deleting message')
      });
    } else if (this.selectedGroup) {
      this.chatService.deleteGroupMessage(this.selectedGroup.id, msg.id).subscribe({
        next: () => this.messages = this.messages.filter(m => m.id !== msg.id),
        error: () => alert('Error deleting group message')
      });
    }
  }

  onSearchUsers(query: string): void { // Explicit string for TS2345 fix
    if (!query) {
      this.loadUsers();
    } else {
      this.users = this.users.filter(u => u.username.toLowerCase().includes(query.toLowerCase()));
    }
  }

  onLogout(): void {
    this.authService.logout();
  }

  openCreateGroup(): void {
    const dialogRef = this.dialog.open(CreateGroupDialogComponent, {
      width: '400px',
      data: { users: this.users }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.chatService.createGroup(result.name, result.members).subscribe({
          next: () => {
            this.loadGroups();
            alert('Group created!');
          },
          error: () => alert('Error creating group')
        });
      }
    });
  }

  private startSignalR(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.BASE_URL}/chatHub`)
      .build();

    this.hubConnection.start().then(() => {
      console.log('SignalR connected');
    }).catch(err => console.error('SignalR connection error', err));

    this.hubConnection.on('ReceiveMessage', (message: any) => {
      if (this.selectedUser?.id === message.senderId || this.authService.getCurrentUser()?.userId === message.senderId) {
        this.fetchUserMessages(this.selectedUser?.id || message.senderId);
      }
    });

    this.hubConnection.on('ReceiveGroupMessage', (message: any) => {
      if (this.selectedGroup?.id === message.groupId) {
        this.fetchGroupMessages(this.selectedGroup.id);
      }
    });

    this.hubConnection.on('UserOnlineStatusChanged', (userId: number, isOnline: boolean) => {
      this.onlineUsers.set(userId, isOnline);
      localStorage.setItem(`online_${userId}`, isOnline.toString());
      this.cdr.detectChanges();
    });
  }

  private stopSignalR(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
      this.hubConnection = null;
    }
  }

  private fetchUserMessages(userId: number): void {
    this.chatService.getChatMessages(userId).subscribe({
      next: (msgs) => this.messages = msgs,
      error: () => alert('Error loading messages')
    });
  }

  private fetchGroupMessages(groupId: number): void {
    this.chatService.getGroupMessages(groupId).subscribe({
      next: (msgs) => this.messages = msgs,
      error: () => alert('Error loading group messages')
    });
  }

  private updateOnlineStatuses(): void {
    this.users.forEach(user => {
      this.onlineUsers.set(user.id, localStorage.getItem(`online_${user.id}`) === 'true');
    });
  }

  private startPolling(): void {
    this.clearPolling();
    if (!(this.selectedUser || this.selectedGroup)) return;
    this.pollIntervalId = setInterval(() => {
      if (this.selectedUser) this.fetchUserMessages(this.selectedUser.id);
      if (this.selectedGroup) this.fetchGroupMessages(this.selectedGroup.id);
    }, 1000);
  }

  private clearPolling(): void {
    if (this.pollIntervalId) {
      clearInterval(this.pollIntervalId);
      this.pollIntervalId = null;
    }
  }
}