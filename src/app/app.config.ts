import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { CatRepository } from './domain/abstractions/cat-repository.abstract';
import { UserRepository } from './domain/abstractions/user-repository.abstract';
import { CatHttpRepository } from './infrastructure/data-access/cat-http.repository';
import { UserHttpRepository } from './infrastructure/data-access/user-http.repository';
import { CatUseCase } from './application/use-cases/cat.usecase';
import { UserUseCase } from './application/use-cases/user.usecase';
import { AuthStore } from './application/state/auth.store';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./presentation/views/users/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./presentation/views/users/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'cats',
    loadComponent: () => import('./presentation/views/cats/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'cats/search',
    loadComponent: () => import('./presentation/views/cats/breed-list-table.component').then(m => m.BreedListTableComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./presentation/views/users/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    
    // Stores
    AuthStore,
    
    // Repositories
    { provide: CatRepository, useClass: CatHttpRepository },
    { provide: UserRepository, useClass: UserHttpRepository },
    
    // Use Cases
    CatUseCase,
    UserUseCase,
    
    // Guards
    AuthGuard
  ]
};
