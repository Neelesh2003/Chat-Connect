import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  userId: number;
  username: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly BASE_URL = environment.BASE_URL + '/Auth';
  private readonly TOKEN_KEY = 'token';

  constructor(private http: HttpClient) {}

  signup(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/register`, data);
  }

  login(data: any): Observable<string> {
    return this.http.post(`${this.BASE_URL}/login`, data, { responseType: 'text' });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    window.location.href = '/';
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = jwtDecode<JwtPayload>(token);
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  getCurrentUser(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  }

  getUsers(): Observable<any[]> {
    return this.http.get(`${this.BASE_URL}/users`, { responseType: 'text' }).pipe(
      map(res => JSON.parse(res))
    );
  }

  getUserByUsername(username: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/get-user/${username}`, { responseType: 'text' }).pipe(
      map(res => JSON.parse(res))
    );
  }
}