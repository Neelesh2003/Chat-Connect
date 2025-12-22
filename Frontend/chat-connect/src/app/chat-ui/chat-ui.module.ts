import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChatUiRoutingModule } from './chat-ui-routing.module';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { MessageInputComponent } from './components/message-input/message-input.component';
import { ChatService } from './services/chat.service';
import { SignalRService } from './services/signalr.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CoreModule } from "../core/core.module";


@NgModule({
  declarations: [
    DashboardComponent,
    SidebarComponent,
    ChatWindowComponent,
    MessageInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ChatUiRoutingModule,
    CoreModule
],
  providers: [
    ChatService,
    SignalRService
  ]
})
export class ChatUiModule { }