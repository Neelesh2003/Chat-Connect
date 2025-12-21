import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map(isAuth => {
        if (isAuth) return true;
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}