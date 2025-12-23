import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ChatService } from '../../../shared/services/chat.service';
import { LoaderService } from '../../../shared/services/loader.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
})
export class ChatWindowComponent implements OnChanges {
  @Input() currentUser: string | null = null;
  @Input() selectedUser: any = null;
  @Input() selectedGroup: any = null;
  @Input() messages: any[] = [];

  @Output() sendMessage = new EventEmitter<SendMessageEvent>();
  @Output() deleteMessage = new EventEmitter<any>();

  newMessage = '';
  selectedFile: File | null = null;
  imagePreview: SafeUrl | null = null;
  uploadProgress = 0;

  @ViewChild('bottomRef') bottomRef!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private chatService: ChatService,
    private loaderService: LoaderService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
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
      this.fileInput.nativeElement.value = '';
      return;
    }
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Only images (JPEG/PNG/GIF) are supported');
      this.fileInput.nativeElement.value = '';
    }
  }

  private uploadImage(): void {
    if (!this.selectedFile) return;
    this.loaderService.show();
    this.chatService.uploadImage(this.selectedFile).subscribe({
      next: (response: any) => {
        const url = response.url; // Assume backend returns { url: '...' }
        this.sendMessage.emit({
          receiverId: this.selectedUser?.id,
          groupId: this.selectedGroup?.id,
          message: url,
          isImage: true
        });
        this.resetInput();
        this.loaderService.hide();
      },
      error: (err) => {
        alert('Upload failed');
        console.error(err);
        this.resetInput();
        this.loaderService.hide();
      }
    });
  }

  onSend(): void {
    if (!this.newMessage.trim() && !this.selectedFile) return;

    if (this.selectedFile) {
      // Upload image first
      this.uploadImage();
    } else {
      // Send text directly
      this.sendMessage.emit({
        receiverId: this.selectedUser?.id,
        groupId: this.selectedGroup?.id,
        message: this.newMessage,
        isImage: false
      });
      this.resetInput();
    }
  }

  private resetInput(): void {
    this.newMessage = '';
    this.selectedFile = null;
    this.imagePreview = null;
    this.uploadProgress = 0;
    this.fileInput.nativeElement.value = '';
    this.cdr.detectChanges();
  }

  onDelete(msg: any): void {
    this.deleteMessage.emit(msg);
  }

  onImageClick(url: string): void {
    if (url.startsWith('http')) {
      window.open(url, '_blank');
    }
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