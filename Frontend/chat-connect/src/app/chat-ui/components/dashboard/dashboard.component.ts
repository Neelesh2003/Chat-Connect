import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: any;
  private subscription: Subscription = new Subscription();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.authService.isLoggedIn$().subscribe(isLoggedIn => {
        if (!isLoggedIn) {
          this.authService.router.navigate(['/login']);
        }
      })
    );
    // Get current user from token or service
    const token = this.authService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.currentUser = { id: payload.userId, username: payload.username };
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}