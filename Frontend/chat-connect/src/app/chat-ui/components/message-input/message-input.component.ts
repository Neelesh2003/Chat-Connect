import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { SignalRService } from '../../services/signalr.service';
import { LoaderService } from '../../../core/services/loader.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SendMessageRequest, SendGroupMessageRequest } from '../../models/chat.models';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-message-input',
  standalone: false,
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss']
})
export class MessageInputComponent {
  @Input() selectedUser: any;
  @Input() selectedGroup: any;
  @Input() currentUser: any;
  @Output() messageSent = new EventEmitter<void>();

  @ViewChild('fileInput') fileInput!: ElementRef;

  newMessage = '';
  selectedFile: File | null = null;
  imagePreview: SafeUrl | null = null;

  constructor(
    private chatService: ChatService,
    private signalRService: SignalRService,
    private loaderService: LoaderService,
    private sanitizer: DomSanitizer
  ) {
    // Typing indicator on input
    this.signalRService.typingUsers$.subscribe(() => {});
  }

  onMessageInput(): void {
    this.signalRService.startTyping();
    setTimeout(() => this.signalRService.stopTyping(), 10000);
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  sendMessage(): void {
    if (!this.newMessage.trim() && !this.selectedFile) return;

    const content = this.selectedFile ? this.imagePreview?.toString() || '' : this.newMessage;
    const isImage = !!this.selectedFile;

    if (this.selectedUser) {
      const request: SendMessageRequest = { receiverId: this.selectedUser.id, message: content };
      this.chatService.sendMessage(request).subscribe(msg => {
        this.signalRService.sendPrivateMessage(msg);
        this.messageSent.emit();
      });
    } else if (this.selectedGroup) {
      const request: SendGroupMessageRequest = { message: content };
      this.chatService.sendGroupMessage(this.selectedGroup.id, request).subscribe(msg => {
        this.signalRService.sendGroupMessage(msg);
        this.messageSent.emit();
      });
    }

    this.newMessage = '';
    this.selectedFile = null;
    this.imagePreview = null;
    this.fileInput.nativeElement.value = '';
  }
}