import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
  // Removed standalone/imports - NgModule handles
})
export class SidebarComponent {
  @Input() user: string | null = null;
  @Input() users: any[] = [];
  @Input() groups: any[] = [];
  @Input() onlineUsers = new Map<number, boolean>();
  @Input() selectedUser: any = null;
  @Input() selectedGroup: any = null;

  @Output() selectUser = new EventEmitter<any>();
  @Output() selectGroup = new EventEmitter<any>();
  @Output() logoutEvent = new EventEmitter<void>();
  @Output() searchEvent = new EventEmitter<string>(); // Explicit string
  @Output() createGroup = new EventEmitter<void>();

  activeTab: 'users' | 'groups' = 'users';
  searchUser = '';

  switchTab(tab: 'users' | 'groups'): void {
    this.activeTab = tab;
    if (tab === 'groups') {
      this.searchUser = '';
      this.searchEvent.emit('');
    }
  }

  onLogout(): void {
    this.logoutEvent.emit();
  }

  onSearch(): void {
    this.searchEvent.emit(this.searchUser.trim());
  }

  onInputChange(value: string): void {
    this.searchUser = value;
    if (!value.trim()) {
      this.searchEvent.emit('');
    }
  }
}