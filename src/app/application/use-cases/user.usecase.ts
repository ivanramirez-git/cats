import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserRepository } from '../../domain/abstractions/user-repository.abstract';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../../domain/models/user.model';
import { AuthStore } from '../state/auth.store';

@Injectable({
  providedIn: 'root'
})
export class UserUseCase {
  constructor(
    private userRepository: UserRepository,
    private authStore: AuthStore
  ) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.userRepository.login(credentials).pipe(
      tap(response => {
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.email // Usar email como name por defecto
        };
        this.authStore.setUser(user);
        this.authStore.setToken(response.token);
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.userRepository.register(userData).pipe(
      tap(response => {
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.email // Usar email como name por defecto
        };
        this.authStore.setUser(user);
        this.authStore.setToken(response.token);
      })
    );
  }

  logout(): void {
    this.authStore.clearAuth();
  }

  isAuthenticated(): boolean {
    return this.authStore.isAuthenticated();
  }

  getUser(): User | null {
    return this.authStore.getUser();
  }
}