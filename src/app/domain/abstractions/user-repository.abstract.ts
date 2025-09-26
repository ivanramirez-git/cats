import { Observable } from 'rxjs';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

export abstract class UserRepository {
  abstract login(credentials: LoginRequest): Observable<AuthResponse>;
  abstract register(userData: RegisterRequest): Observable<AuthResponse>;
  abstract getCurrentUser(): Observable<User>;
}