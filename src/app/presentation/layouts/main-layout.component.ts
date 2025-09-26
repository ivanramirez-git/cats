import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService, User } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="layout">
      <!-- Navbar -->
      <nav class="navbar">
        <div class="navbar-content">
          <!-- Logo/Brand -->
          <div class="navbar-brand">
            <h2>Cat Explorer</h2>
          </div>

          <!-- Desktop Menu -->
          <div class="navbar-menu desktop-menu">
            <button 
              class="nav-button"
              (click)="navigateTo('/breeds')"
              [class.active]="isCurrentRoute('/breeds')">
              Inicio
            </button>
            <button 
              class="nav-button"
              (click)="navigateTo('/breeds/table')"
              [class.active]="isCurrentRoute('/breeds/table')">
              Ver Tabla
            </button>
            <button 
              class="nav-button"
              (click)="navigateTo('/profile')"
              [class.active]="isCurrentRoute('/profile')">
              Mi Perfil
            </button>
          </div>

          <!-- User Info & Logout -->
          <div class="navbar-user desktop-menu">
            <span class="user-email" *ngIf="currentUser">{{ currentUser.email }}</span>
            <button class="logout-button" (click)="logout()">
              Cerrar Sesión
            </button>
          </div>

          <!-- Mobile Hamburger -->
          <button class="hamburger-button mobile-menu" (click)="toggleMobileMenu()">
            <span class="hamburger-line" [class.active]="isMobileMenuOpen"></span>
            <span class="hamburger-line" [class.active]="isMobileMenuOpen"></span>
            <span class="hamburger-line" [class.active]="isMobileMenuOpen"></span>
          </button>
        </div>

        <!-- Mobile Menu -->
        <div class="mobile-nav-menu" [class.open]="isMobileMenuOpen">
          <button 
            class="mobile-nav-button"
            (click)="navigateToMobile('/breeds')"
            [class.active]="isCurrentRoute('/breeds')">
            Inicio
          </button>
          <button 
            class="mobile-nav-button"
            (click)="navigateToMobile('/breeds/table')"
            [class.active]="isCurrentRoute('/breeds/table')">
            Ver Tabla
          </button>
          <button 
            class="mobile-nav-button"
            (click)="navigateToMobile('/profile')"
            [class.active]="isCurrentRoute('/profile')">
            Mi Perfil
          </button>
          <div class="mobile-user-info" *ngIf="currentUser">
            <span class="mobile-user-email">{{ currentUser.email }}</span>
            <button class="mobile-logout-button" (click)="logout()">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .navbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .navbar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .navbar-brand h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .navbar-menu {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .nav-button {
      background: none;
      border: none;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .nav-button:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-1px);
    }

    .nav-button.active {
      background: rgba(255, 255, 255, 0.2);
      font-weight: 600;
    }

    .navbar-user {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-email {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .logout-button {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.3s ease;
    }

    .logout-button:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
    }

    .hamburger-button {
      display: none;
      flex-direction: column;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      gap: 3px;
    }

    .hamburger-line {
      width: 25px;
      height: 3px;
      background: white;
      transition: all 0.3s ease;
      transform-origin: center;
    }

    .hamburger-line.active:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }

    .hamburger-line.active:nth-child(2) {
      opacity: 0;
    }

    .hamburger-line.active:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
    }

    .mobile-nav-menu {
      display: none;
      flex-direction: column;
      background: rgba(0, 0, 0, 0.1);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .mobile-nav-menu.open {
      display: flex;
    }

    .mobile-nav-button {
      background: none;
      border: none;
      color: white;
      padding: 1rem 2rem;
      text-align: left;
      cursor: pointer;
      font-size: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      transition: background 0.3s ease;
    }

    .mobile-nav-button:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .mobile-nav-button.active {
      background: rgba(255, 255, 255, 0.2);
      font-weight: 600;
    }

    .mobile-user-info {
      padding: 1rem 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .mobile-user-email {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .mobile-logout-button {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      width: fit-content;
      transition: all 0.3s ease;
    }

    .mobile-logout-button:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .main-content {
      flex: 1;
      padding: 2rem;
      background: #f8fafc;
      min-height: calc(100vh - 80px);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .desktop-menu {
        display: none;
      }

      .mobile-menu {
        display: flex;
      }

      .navbar-content {
        padding: 1rem;
      }

      .navbar-brand h2 {
        font-size: 1.3rem;
      }

      .main-content {
        padding: 1rem;
      }
    }

    @media (max-width: 480px) {
      .navbar-brand h2 {
        font-size: 1.2rem;
      }
      
      .main-content {
        padding: 0.5rem;
      }
    }
  `]
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isMobileMenuOpen = false;
  private authSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.authState$.subscribe(state => {
      this.currentUser = state.user;
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  navigateToMobile(route: string): void {
    this.router.navigate([route]);
    this.isMobileMenuOpen = false;
  }

  isCurrentRoute(route: string): boolean {
    return this.router.url === route;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.isMobileMenuOpen = false;
  }
}