import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { SignalRService } from '../../services/signalr.service';
import { User, GroupResponse } from '../../models/chat.models';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() currentUser: any;
  @Output() selectUser = new EventEmitter<User>();
  @Output() selectGroup = new EventEmitter<GroupResponse>();
  @Output() logoutEvent = new EventEmitter<void>();

  users: User[] = [];
  groups: GroupResponse[] = [];
  searchTerm = '';
  activeTab = 'users';
  newGroupName = '';
  newGroupMembers: number[] = [];

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private signalRService: SignalRService
  ) {}

  ngOnInit(): void {
    this.chatService.getUsers().subscribe(users => {
      this.users = users;
    });
    // Load groups (assume API call)
    this.loadGroups();
    this.signalRService.onlineUsers$.subscribe(onlineIds => {
      this.users = this.users.map(u => ({ ...u, isOnline: onlineIds.includes(u.id) }));
    });
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.searchTerm = '';
  }

  onSearch(): void {
    // Filter users
    const filtered = this.users.filter(u => u.username.toLowerCase().includes(this.searchTerm.toLowerCase()));
    // Update list
  }

  onSelectUser(user: User): void {
    this.selectUser.emit(user);
  }

  onSelectGroup(group: GroupResponse): void {
    this.selectGroup.emit(group);
  }

  createGroup(): void {
    if (!this.newGroupName.trim()) return;
    const request = { name: this.newGroupName, members: this.newGroupMembers };
    this.chatService.createGroup(request).subscribe(group => {
      this.groups.push(group);
      this.newGroupName = '';
      this.newGroupMembers = [];
      alert('Group created!');
    });
  }

  addMemberToGroup(userId: number): void {
    if (!this.newGroupMembers.includes(userId)) {
      this.newGroupMembers.push(userId);
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.logoutEvent.emit();
  }

  private loadGroups(): void {
    // Assume API for groups
    this.groups = []; // Placeholder
  }
}