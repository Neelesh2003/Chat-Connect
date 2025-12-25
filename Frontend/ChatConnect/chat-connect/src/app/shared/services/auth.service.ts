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

  login(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/login`, data);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    window.location.href = '/';
  }

 getToken(): string | null {
  const token = localStorage.getItem('token');
  return token;
}

 isLoggedIn(): boolean {
  const token = this.getToken()?.toString();
  if (!token) return false;

  try {
    const payload = jwtDecode<JwtPayload>(token);
    if (!payload.exp) return false;

    return payload.exp * 1000 > Date.now();
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

  getUsers(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/users`);
  }

  getUserByUsername(username: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/get-user/${username}`, { responseType: 'text' }).pipe(
      map(res => JSON.parse(res))
    );
  }
}