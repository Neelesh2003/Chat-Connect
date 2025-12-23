import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Added for ngModel/ngForm
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';
import { ChatPageComponent } from './chat-page.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { CreateGroupDialogComponent } from './components/create-group-dialog/create-group-dialog.component';

@NgModule({
  declarations: [
    ChatPageComponent,
    SidebarComponent,
    ChatWindowComponent,
    CreateGroupDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule, // Enables template-driven forms
    MatDialogModule,
    RouterModule.forChild([{ path: '', component: ChatPageComponent }]),
    SharedModule
  ]
})
export class ChatModule { }