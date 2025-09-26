import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRepository } from '../../domain/abstractions/user-repository.abstract';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../../domain/models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserHttpRepository extends UserRepository {
  private readonly baseUrl = environment.backendUrl;

  constructor(private http: HttpClient) {
    super();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/users/login`, credentials);
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/users/register`, userData);
  }
}