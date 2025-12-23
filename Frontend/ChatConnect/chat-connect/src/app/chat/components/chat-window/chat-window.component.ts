import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../shared/services/chat.service';
import { LoaderService } from '../../../shared/services/loader.service';

interface SendMessageEvent {
  receiverId?: number;
  groupId?: number;
  message: string;
  isImage?: boolean;
}

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
  // Removed standalone/imports - NgModule handles
})
export class ChatWindowComponent implements OnChanges {
  @Input() currentUser: string | null = null;
  @Input() selectedUser: any = null;
  @Input() selectedGroup: any = null;
  @Input() messages: any[] = [];

  @Output() sendMessage = new EventEmitter<SendMessageEvent>(); // Explicit type
  @Output() deleteMessage = new EventEmitter<any>();

  newMessage = '';
  selectedFile: File | null = null;
  uploadProgress = 0;

  @ViewChild('bottomRef') bottomRef!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private chatService: ChatService,
    private loaderService: LoaderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['messages']) {
      setTimeout(() => this.scrollToBottom(), 0);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      this.uploadImage();
    } else {
      alert('Only images (JPEG/PNG/GIF) are supported');
    }
  }

  private uploadImage(): void {
    if (!this.selectedFile) return;
    this.loaderService.show();
    // Note: For real progress, add { reportProgress: true } to http.post and handle events
    this.chatService.uploadImage(this.selectedFile).subscribe({
      next: (response: any) => {
        this.sendMessage.emit({
          receiverId: this.selectedUser?.id,
          groupId: this.selectedGroup?.id,
          message: response.url, // Assume API returns { url: '...' }
          isImage: true
        });
        this.selectedFile = null;
        this.uploadProgress = 100; // Simulate; use events for real
        setTimeout(() => this.uploadProgress = 0, 1000);
        this.fileInput.nativeElement.value = '';
        this.loaderService.hide();
      },
      error: () => {
        alert('Upload failed');
        this.loaderService.hide();
      }
    });
  }

  onSend(): void {
    if (!this.newMessage.trim() && !this.selectedFile) return;
    this.sendMessage.emit({
      receiverId: this.selectedUser?.id,
      groupId: this.selectedGroup?.id,
      message: this.newMessage,
      isImage: !!this.selectedFile
    });
    this.newMessage = '';
    this.selectedFile = null;
  }

  onDelete(msg: any): void {
    this.deleteMessage.emit(msg);
  }

  scrollToBottom(): void {
    const el = this.bottomRef?.nativeElement;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }

  getTitle(): string {
    if (this.selectedUser) return `Chat with ${this.selectedUser.username}`;
    if (this.selectedGroup) return this.selectedGroup.name;
    return 'Select a user or group to start chatting';
  }

  isImageMessage(msg: any): boolean {
    return msg.isImage || (msg.content && msg.content.startsWith('http') && msg.content.match(/\.(jpeg|jpg|png|gif)$/i));
  }

  getFormattedTime(createdAt: string | Date | undefined): string {
    if (!createdAt) return '';
    const date = new Date(createdAt);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}