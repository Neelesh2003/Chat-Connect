import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoaderService } from 'src/app/core/services/loader.service';
import { environment } from 'src/environments/environment.prod';
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'auth_token';
  private loggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(
    private http: HttpClient,
    public router: Router,
    private loaderService: LoaderService
  ) {}

  login(user: LoginRequest): Observable<AuthResponse> {
    this.loaderService.show();
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, user).pipe(
      map(response => {
        this.setToken(response);
        // this.loaderService.hide();
        return response;
      })
    );
  }

  signup(user: RegisterRequest): Observable<any> {
    this.loaderService.show();
    return this.http.post<any>(`${this.apiUrl}/register`, user).pipe(
      map(response => {
        this.loaderService.hide();
        return response;
      })
    );
  }

  setToken(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    this.loggedInSubject.next(true);
    this.router.navigate(['/chat']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.loggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn$(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }
}