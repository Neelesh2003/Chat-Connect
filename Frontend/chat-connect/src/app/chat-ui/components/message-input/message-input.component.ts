import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { SendMessageRequest } from '../../models/chat.models';
import * as ChatActions from '../../store/chat.actions';
import { SignalRService } from '../../services/signalr.service';

@Component({
  selector: 'app-message-input',
  standalone: false,
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss']
})
export class MessageInputComponent {
  messageControl = new FormControl('');
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private store: Store,
    private signalR: SignalRService
  ) {
    this.messageControl.valueChanges.subscribe(() => {
      this.signalR.startTyping(0); // Chat ID from state
      setTimeout(() => this.signalR.stopTyping(0), 1000);
    });
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
        this.selectedFile = file;
      };
      reader.readAsDataURL(file);
    }
  }

  onSend(): void {
    if (this.messageControl.value?.trim() || this.selectedFile) {
      const request: SendMessageRequest = {
        content: this.selectedFile ? this.imagePreview! : this.messageControl.value!,
        isImage: !!this.selectedFile
      };
      this.store.dispatch(ChatActions.sendMessage({ request }));
      this.messageControl.setValue('');
      this.selectedFile = null;
      this.imagePreview = null;
    }
  }
}