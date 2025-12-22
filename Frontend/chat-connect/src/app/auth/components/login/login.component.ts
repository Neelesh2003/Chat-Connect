import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../../core/services/loader.service';
import { LoginRequest, AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: LoginRequest = { username: '', password: '' };
  returnUrl = '/chat';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    // private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/chat';
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  login(): void {
    if (!this.user.username.trim() || !this.user.password.trim()) {
      alert('Please enter username and password');
      return;
    }
    this.authService.login(this.user).subscribe({
      next: (response) => {
        this.authService.setToken(response);
      },
      error: (error) => {
        alert('Invalid login');
      }
    });
  }
}