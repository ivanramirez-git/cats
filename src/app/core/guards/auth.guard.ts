import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserUseCase } from '../../application/use-cases/user.usecase';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private userUseCase: UserUseCase,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.userUseCase.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}