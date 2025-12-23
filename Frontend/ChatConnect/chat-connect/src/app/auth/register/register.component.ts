import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
        alert(response);
        this.registerBtnClicked = false;
        this.loaderService.hide();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        alert(error?.error?.message || 'Registration failed');
        this.registerBtnClicked = false;
        this.loaderService.hide();
      }
    });
  }
}