import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/api';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly TOKEN_EXPIRY_KEY = 'auth_token_expiry';
  
  private authState = new BehaviorSubject<AuthState>({
    isLoggedIn: false,
    user: null,
    token: null
  });

  public authState$ = this.authState.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userStr = localStorage.getItem(this.USER_KEY);
    const tokenExpiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);

    if (token && userStr && tokenExpiry) {
      const expiryDate = new Date(tokenExpiry);
      const now = new Date();

      if (now < expiryDate) {
        const user = JSON.parse(userStr);
        this.authState.next({
          isLoggedIn: true,
          user,
          token
        });
      } else {
        // Token expirado, limpiar localStorage
        this.clearAuthData();
      }
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/users/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        this.setAuthData(response.token, response.user);
        this.authState.next({
          isLoggedIn: true,
          user: response.user,
          token: response.token
        });
      })
    );
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/users/register`, {
      email,
      password
    });
  }

  logout(): void {
    this.clearAuthData();
    this.authState.next({
      isLoggedIn: false,
      user: null,
      token: null
    });
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const tokenExpiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    
    if (!token || !tokenExpiry) {
      return false;
    }

    const expiryDate = new Date(tokenExpiry);
    const now = new Date();
    
    if (now >= expiryDate) {
      this.clearAuthData();
      return false;
    }

    return true;
  }

  getToken(): string | null {
    if (this.isAuthenticated()) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  getCurrentUser(): User | null {
    if (this.isAuthenticated()) {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  private setAuthData(token: string, user: User): void {
    // Los tokens duran 24 horas según el backend
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24);

    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryDate.toISOString());
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
  }
}