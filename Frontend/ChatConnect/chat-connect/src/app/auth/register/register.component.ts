import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { LoaderService } from '../../shared/services/loader.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  username = '';
  password = '';
  registerBtnClicked = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/chat']);
    }
  }

  register(): void {
    if (!this.username?.trim() || !this.password?.trim()) {
      alert('Please enter a valid username and password');
      return;
    }
    if (this.registerBtnClicked) return;
    this.registerBtnClicked = true;
    this.loaderService.show();

    const user = { username: this.username.trim(), password: this.password.trim() };

    this.authService.signup(user).subscribe({
      next: (response) => {
        // ✅ FIXED: Handle object response properly
        const message = typeof response === 'string' 
          ? response 
          : (response?.message || 'Registration successful!');
        alert(message);
        this.registerBtnClicked = false;
        this.loaderService.hide();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration error:', error);
        const errorMsg = error?.error?.message || error?.error || 'Registration failed';
        alert(typeof errorMsg === 'string' ? errorMsg : 'Registration failed');
        this.registerBtnClicked = false;
        this.loaderService.hide();
      }
    });
  }
}