import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule, Routes } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LayoutComponent } from './components/layout/layout.component';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { MessageInputComponent } from './components/message-input/message-input.component';
import { chatReducer } from './store/chat.reducer';
import { ChatEffects } from './store/chat.effects';
import { SignalRService } from './services/signalr.service';
import { ChatService } from './services/chat.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CoreModule } from "../core/core.module";


const routes: Routes = [
  { path: '', component: LayoutComponent }
];

@NgModule({
  declarations: [
    LayoutComponent,
    ChatListComponent,
    ChatWindowComponent,
    MessageInputComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('chat', chatReducer),
    EffectsModule.forFeature([ChatEffects]),
    InfiniteScrollModule,
    DragDropModule,
    CoreModule
],
  providers: [SignalRService, ChatService]
})
export class ChatUiModule { }