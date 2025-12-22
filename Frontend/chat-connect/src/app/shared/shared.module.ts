import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AvatarComponent } from './components/avatar/avatar.component';
import { MessageBubbleComponent } from './components/message-bubble/message-bubble.component';
import { ModalComponent } from './components/modal/modal.component';
import { NotificationComponent } from './components/notification/notification.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { CoreModule } from "../core/core.module";

@NgModule({
  declarations: [
    AvatarComponent,
    MessageBubbleComponent,
    LoadingSpinnerComponent,
    ModalComponent,
    NotificationComponent
  ],
  imports: [CommonModule, FormsModule, CoreModule],
  exports: [
    AvatarComponent,
    MessageBubbleComponent,
    LoadingSpinnerComponent,
    ModalComponent,
    NotificationComponent
  ]
})
export class SharedModule { }