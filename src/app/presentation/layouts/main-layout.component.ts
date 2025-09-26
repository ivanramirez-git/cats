import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthStore } from '../../application/state/auth.store';
import { Observable } from 'rxjs';
import { User } from '../../domain/models/user.model';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <ng-container *ngIf="user$ | async as user; else unauthenticatedLayout">
      <mat-toolbar color="primary">
        <span>Cat Breeds App</span>
        <span class="spacer"></span>
        <nav>
          <a mat-button routerLink="/cats">
            <mat-icon>home</mat-icon>
            Inicio
          </a>
          <a mat-button routerLink="/cats/search">
            <mat-icon>search</mat-icon>
            Buscar Razas
          </a>
          <a mat-button routerLink="/profile">
            <mat-icon>person</mat-icon>
            Perfil
          </a>
          <button mat-button (click)="logout()">
            <mat-icon>logout</mat-icon>
            Cerrar Sesión
          </button>
        </nav>
      </mat-toolbar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </ng-container>
    
    <ng-template #unauthenticatedLayout>
      <main class="main-content full-height">
        <router-outlet></router-outlet>
      </main>
    </ng-template>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    
    nav {
      display: flex;
      gap: 8px;
    }
    
    .main-content {
      padding: 20px;
      min-height: calc(100vh - 64px);
    }
    
    .full-height {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class MainLayoutComponent {
  user$: Observable<User | null>;

  constructor(
    private authStore: AuthStore,
    private router: Router
  ) {
    this.user$ = this.authStore.user$;
  }

  logout(): void {
    this.authStore.clearAuth();
    this.router.navigate(['/']);
  }
}