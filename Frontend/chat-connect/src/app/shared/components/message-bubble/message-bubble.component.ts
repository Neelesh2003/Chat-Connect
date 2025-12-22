import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MessageResponse } from 'src/app/chat-ui/models/chat.models';

@Component({
  selector: 'app-message-bubble',
  standalone: false,
  templateUrl: './message-bubble.component.html',
  styleUrls: ['./message-bubble.component.scss']
})
export class MessageBubbleComponent {
  @Input() message!: MessageResponse;
  @Input() isOwnMessage: boolean = false;
  @Input() currentUserId: number = 0;
  @Output() deleteMessage = new EventEmitter<MessageResponse>();

  onDelete(): void {
    this.deleteMessage.emit(this.message);
  }
}