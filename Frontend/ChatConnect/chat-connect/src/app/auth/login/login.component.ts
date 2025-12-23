import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { LoaderService } from '../../shared/services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  loginBtnClicked = false;

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

  login(): void {
    if (!this.username?.trim() || !this.password?.trim()) {
      alert('Please enter a valid username and password');
      return;
    }
    if (this.loginBtnClicked) return;
    this.loginBtnClicked = true;
    this.loaderService.show();

    const user = { username: this.username, password: this.password };

    this.authService.login(user).subscribe({
      next: (response) => {
        this.authService.setToken(response);
        this.loginBtnClicked = false;
        this.loaderService.hide();
        this.router.navigate(['/chat']);
      },
      error: () => {
        alert('Invalid login');
        this.loginBtnClicked = false;
        this.loaderService.hide();
      }
    });
  }
}