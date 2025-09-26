import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { GuestGuard } from './core/guards/guest.guard';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { CatRepository } from './domain/abstractions/cat-repository.abstract';
import { UserRepository } from './domain/abstractions/user-repository.abstract';
import { CatHttpRepository } from './infrastructure/data-access/cat-http.repository';
import { UserHttpRepository } from './infrastructure/data-access/user-http.repository';
import { CatUseCase } from './application/use-cases/cat.usecase';
import { UserUseCase } from './application/use-cases/user.usecase';

const routes: Routes = [
  // RUTAS PÚBLICAS (solo para usuarios NO autenticados)
  {
    path: 'login',
    canActivate: [GuestGuard],
    loadComponent: () => import('./presentation/views/users/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    canActivate: [GuestGuard],
    loadComponent: () => import('./presentation/views/users/register.component').then(m => m.RegisterComponent)
  },

  // RUTAS PROTEGIDAS CON LAYOUT (solo para usuarios autenticados)
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () => import('./presentation/layouts/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      { path: '', redirectTo: 'breeds', pathMatch: 'full' },

      // Vista 1: Lista desplegable y carrusel
      { 
        path: 'breeds', 
        loadComponent: () => import('./presentation/views/cats/home.component').then(m => m.HomeComponent)
      },
      
      // Vista 2: Tabla con filtro de búsqueda
      { 
        path: 'breeds/table', 
        loadComponent: () => import('./presentation/views/cats/breed-list-table.component').then(m => m.BreedListTableComponent)
      },

      // Vista 5: Perfil protegido
      { 
        path: 'profile', 
        loadComponent: () => import('./presentation/views/users/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },

  // Manejo de rutas no encontradas
  { path: '**', redirectTo: 'login' }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    
    // Repositories
    { provide: CatRepository, useClass: CatHttpRepository },
    { provide: UserRepository, useClass: UserHttpRepository },
    
    // Use Cases
    CatUseCase,
    UserUseCase,
    
    // Guards
    AuthGuard,
    GuestGuard
  ]
};
