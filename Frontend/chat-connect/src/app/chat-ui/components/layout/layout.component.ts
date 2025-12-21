import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as ChatActions from '../../store/chat.actions';
import { SignalRService } from '../../services/signalr.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  constructor(
    private store: Store,
    private signalR: SignalRService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.store.dispatch(ChatActions.loadChats());
      this.signalR.startConnection();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.signalR.stopConnection();
  }
}