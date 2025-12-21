import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { RegisterRequest, LoginRequest, AuthResponse, User, AuthState } from '../models/auth.models';
import { environment } from 'src/environments/environment.development';
import * as AuthActions from '../store/auth.actions';

@Injectable()
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'auth_user';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private store: Store<{ auth: AuthState }>,
    private router: Router
  ) {
    this.checkTokenValidity();
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap(response => this.store.dispatch(AuthActions.loginSuccess({ response }))),
      catchError(error => {
        this.store.dispatch(AuthActions.authFailure({ error: error.message }));
        throw error;
      })
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => this.store.dispatch(AuthActions.loginSuccess({ response }))),
      catchError(error => {
        this.store.dispatch(AuthActions.authFailure({ error: error.message }));
        throw error;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.isAuthenticatedSubject.next(false);
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  private saveAuthData(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response.user));
    this.isAuthenticatedSubject.next(true);
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  public checkTokenValidity(): void {
    if (!this.isAuthenticated()) {
      this.logout();
    }
  }
}