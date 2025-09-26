import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthStore } from '../../application/state/auth.store';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authStore: AuthStore,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authStore.isAuthenticated()) {
      return true;
    }
    
    this.router.navigate(['/']);
    return false;
  }
}