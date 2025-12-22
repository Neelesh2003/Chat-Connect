import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { SignalRService } from '../../services/signalr.service';
import { MessageResponse } from '../../models/chat.models';
import { LoaderService } from '../../../core/services/loader.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-chat-window',
  standalone: false,
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit {
  @Input() currentUser: any;
  @Input() selectedUser: any;
  @Input() selectedGroup: any;
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  messages: MessageResponse[] = [];
  page = 0;
  loadingMore = false;
  imagePreview: SafeUrl | null = null;
  typingUsers: number[] = [];

  constructor(
    private chatService: ChatService,
    private signalRService: SignalRService,
    private loaderService: LoaderService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.signalRService.messages$.subscribe(messages => {
      this.messages = messages;
      this.scrollToBottom();
    });
    this.signalRService.typingUsers$.subscribe(typing => {
      this.typingUsers = typing;
    });
  }

  loadMessages(): void {
    if (this.selectedUser) {
      this.chatService.getConversation(this.selectedUser.id, this.page).subscribe(messages => {
        if (messages.length < 20) this.page = -1; // No more
        this.scrollToBottom();
      });
    } else if (this.selectedGroup) {
      this.chatService.getGroupMessages(this.selectedGroup.id, this.page).subscribe(messages => {
        if (messages.length < 20) this.page = -1;
        this.scrollToBottom();
      });
    }
  }

  onScroll(event: any): void {
    if (event.target.scrollTop === 0 && this.page !== -1) {
      this.page++;
      this.loadMessages();
    }
  }

  scrollToBottom(): void {
    setTimeout(() => {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    }, 100);
  }

  onImageSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onDeleteMessage(msg: MessageResponse): void {
    if (confirm('Delete this message?')) {
      if (this.selectedUser) {
        this.chatService.deleteMessage(msg.id).subscribe(() => {
          this.messages = this.messages.filter(m => m.id !== msg.id);
        });
      } else if (this.selectedGroup) {
        this.chatService.deleteGroupMessage(this.selectedGroup.id, msg.id).subscribe(() => {
          this.messages = this.messages.filter(m => m.id !== msg.id);
        });
      }
    }
  }
}