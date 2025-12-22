import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Notification } from '../../models/shared.models';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: false,
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
  @Input() notification!: Notification;
  visible = true;
  private autoHideSub?: Subscription;

  ngOnInit(): void {
    if (this.notification.duration) {
      this.autoHideSub = interval(this.notification.duration).subscribe(() => {
        this.visible = false;
      });
    }
  }

  ngOnDestroy(): void {
    this.autoHideSub?.unsubscribe();
  }

  close(): void {
    this.visible = false;
  }

  get alertClass(): string {
    return `alert alert-${this.notification.type} alert-dismissible fade show position-fixed`;
  }
}