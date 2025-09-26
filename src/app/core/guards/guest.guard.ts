import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserUseCase } from '../../application/use-cases/user.usecase';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  
  constructor(
    private userUseCase: UserUseCase,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (!this.userUseCase.isAuthenticated()) {
      return true;
    } else {
      // Si ya está autenticado, redirigir a la vista principal
      this.router.navigate(['/breeds']);
      return false;
    }
  }
}