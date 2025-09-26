import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../domain/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private userSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  public user$ = this.userSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  setUser(user: User): void {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  setToken(token: string): void {
    this.tokenSubject.next(token);
    localStorage.setItem('token', token);
  }

  getUser(): User | null {
    return this.userSubject.value;
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.tokenSubject.value;
  }

  clearAuth(): void {
    this.userSubject.next(null);
    this.tokenSubject.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  private loadFromStorage(): void {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (user) {
      this.userSubject.next(JSON.parse(user));
    }
    
    if (token) {
      this.tokenSubject.next(token);
    }
  }
}