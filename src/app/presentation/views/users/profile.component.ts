import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService, User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  template: `
    <div class="profile-container">
      <mat-card class="profile-card">
        <mat-card-header>
          <div mat-card-avatar class="profile-avatar">
            <mat-icon>person</mat-icon>
          </div>
          <mat-card-title>Mi Perfil</mat-card-title>
          <mat-card-subtitle>Información de tu cuenta</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Cargando información del perfil...</p>
          </div>

          <div *ngIf="!loading && user" class="user-info">
            <div class="info-row">
              <mat-icon class="info-icon">fingerprint</mat-icon>
              <div class="info-content">
                <label>ID:</label>
                <span>{{user.id}}</span>
              </div>
            </div>
            
            <mat-divider></mat-divider>
            
            <div class="info-row">
              <mat-icon class="info-icon">email</mat-icon>
              <div class="info-content">
                <label>Email:</label>
                <span>{{user.email}}</span>
              </div>
            </div>
            
            <mat-divider></mat-divider>
            
            <div class="info-row">
              <mat-icon class="info-icon">verified_user</mat-icon>
              <div class="info-content">
                <label>Rol:</label>
                <span class="role-badge">{{user.role}}</span>
              </div>
            </div>
            
            <mat-divider></mat-divider>
            
            <div class="info-row">
              <mat-icon class="info-icon">access_time</mat-icon>
              <div class="info-content">
                <label>Miembro desde:</label>
                <span>{{formatDate(user.createdAt)}}</span>
              </div>
            </div>
            
            <mat-divider></mat-divider>
            
            <div class="info-row">
              <mat-icon class="info-icon">update</mat-icon>
              <div class="info-content">
                <label>Última actualización:</label>
                <span>{{formatDate(user.updatedAt)}}</span>
              </div>
            </div>
          </div>

          <div *ngIf="!loading && !user" class="error-container">
            <mat-icon class="error-icon">error</mat-icon>
            <p>No se pudo cargar la información del perfil</p>
            <button mat-raised-button color="primary" (click)="loadUserProfile()">
              <mat-icon>refresh</mat-icon>
              Reintentar
            </button>
          </div>
        </mat-card-content>
        
        <mat-card-actions class="card-actions">
          <button mat-raised-button color="warn" (click)="logout()">
            <mat-icon>logout</mat-icon>
            Cerrar Sesión
          </button>
          
          <button mat-button routerLink="/breeds" color="primary">
            <mat-icon>home</mat-icon>
            Ir al Inicio
          </button>
        </mat-card-actions>
      </mat-card>
      
      <mat-card class="stats-card">
        <mat-card-header>
          <mat-card-title>Estado de Sesión</mat-card-title>
          <mat-card-subtitle>Información de tu autenticación</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="stats-grid">
            <div class="stat-item">
              <mat-icon class="stat-icon" [class.authenticated]="isAuthenticated">
                {{isAuthenticated ? 'verified' : 'no_accounts'}}
              </mat-icon>
              <div class="stat-content">
                <span class="stat-label">Estado</span>
                <span class="stat-number" [class.authenticated]="isAuthenticated">
                  {{isAuthenticated ? 'Autenticado' : 'No autenticado'}}
                </span>
              </div>
            </div>
            
            <div class="stat-item">
              <mat-icon class="stat-icon">token</mat-icon>
              <div class="stat-content">
                <span class="stat-label">Token</span>
                <span class="stat-number">{{hasToken ? 'Válido' : 'No disponible'}}</span>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      max-width: 800px;
      margin: 20px auto;
      padding: 0 20px;
    }

    .profile-card {
      width: 100%;
    }

    .profile-avatar {
      background-color: #667eea;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 40px 20px;
      text-align: center;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .info-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 8px 0;
    }

    .info-icon {
      color: #667eea;
      flex-shrink: 0;
    }

    .info-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
    }

    .info-content label {
      font-size: 12px;
      color: #666;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-content span {
      font-size: 16px;
      color: #333;
    }

    .role-badge {
      background: #e3f2fd;
      color: #1976d2;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      width: fit-content;
    }

    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 40px 20px;
      text-align: center;
    }

    .error-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #f44336;
    }

    .card-actions {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      padding: 16px 24px;
    }

    .stats-card {
      width: 100%;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      padding: 16px 0;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .stat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #667eea;
    }

    .stat-icon.authenticated {
      color: #4caf50;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-number {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      line-height: 1.2;
    }

    .stat-number.authenticated {
      color: #4caf50;
    }

    @media (max-width: 600px) {
      .profile-container {
        margin: 10px auto;
        padding: 0 10px;
      }
      
      .card-actions {
        flex-direction: column;
      }
      
      .card-actions button {
        width: 100%;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  loading = true;
  isAuthenticated = false;
  hasToken = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.loading = true;
    
    // Obtener información del usuario desde el servicio de autenticación
    this.user = this.authService.getCurrentUser();
    this.isAuthenticated = this.authService.isAuthenticated();
    this.hasToken = !!this.authService.getToken();
    
    this.loading = false;
  }

  logout(): void {
    this.authService.logout();
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'No disponible';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}