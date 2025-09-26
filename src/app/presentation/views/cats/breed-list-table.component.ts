import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CatUseCase } from '../../../application/use-cases/cat.usecase';
import { CatBreed } from '../../../domain/models/cat-breed.model';

@Component({
  selector: 'app-breed-list-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  template: `
    <div class="search-container">
      <h1>Búsqueda de Razas de Gatos</h1>
      
      <mat-card class="search-card">
        <mat-card-header>
          <mat-card-title>Filtro de Búsqueda</mat-card-title>
          <mat-card-subtitle>Ingresa un término para buscar razas específicas</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="search-form">
            <mat-form-field appearance="fill" class="search-field">
              <mat-label>Buscar por nombre, origen o temperamento</mat-label>
              <input 
                matInput 
                [(ngModel)]="searchTerm" 
                (keyup.enter)="searchBreeds()"
                placeholder="Ej: Persian, Egypt, Active..."
                [disabled]="loading">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
            <button 
              mat-raised-button 
              color="primary" 
              (click)="searchBreeds()"
              [disabled]="loading || !searchTerm.trim()"
              class="search-button">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <mat-icon *ngIf="!loading">search</mat-icon>
              <span *ngIf="!loading">Buscar</span>
              <span *ngIf="loading">Buscando...</span>
            </button>
            <button 
              mat-button 
              color="accent" 
              (click)="clearSearch()"
              [disabled]="loading"
              class="clear-button">
              <mat-icon>clear</mat-icon>
              Limpiar
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Estado inicial: sin búsquedas -->
      <div *ngIf="!searchPerformed && !loading" class="no-search-state">
        <mat-card class="info-card">
          <mat-card-content>
            <div class="info-content">
              <mat-icon class="large-icon">search</mat-icon>
              <h2>Busca razas de gatos</h2>
              <p>Ingresa un término de búsqueda para encontrar razas específicas.</p>
              <p class="tip">💡 Puedes buscar por nombre (ej: "Persian"), origen (ej: "Egypt") o temperamento (ej: "Active")</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Loading state -->
      <div *ngIf="loading" class="loading-container">
        <mat-card>
          <mat-card-content>
            <div class="loading-content">
              <mat-spinner></mat-spinner>
              <p>Buscando razas en el servidor...</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Resultados encontrados -->
      <div *ngIf="searchPerformed && !loading && searchResults.length > 0" class="results-container">
        <mat-card>
          <mat-card-header>
            <mat-card-title>
              Resultados de Búsqueda: "{{lastSearchTerm}}"
              <span class="results-count">({{searchResults.length}} encontradas)</span>
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="searchResults" class="breeds-table">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let breed">
                  <strong>{{breed.name}}</strong>
                </td>
              </ng-container>

              <ng-container matColumnDef="origin">
                <th mat-header-cell *matHeaderCellDef>Origen</th>
                <td mat-cell *matCellDef="let breed">{{breed.origin}}</td>
              </ng-container>

              <ng-container matColumnDef="temperament">
                <th mat-header-cell *matHeaderCellDef>Temperamento</th>
                <td mat-cell *matCellDef="let breed" class="temperament-cell">
                  {{breed.temperament}}
                </td>
              </ng-container>

              <ng-container matColumnDef="life_span">
                <th mat-header-cell *matHeaderCellDef>Esperanza de Vida</th>
                <td mat-cell *matCellDef="let breed">{{breed.life_span}} años</td>
              </ng-container>

              <ng-container matColumnDef="weight">
                <th mat-header-cell *matHeaderCellDef>Peso</th>
                <td mat-cell *matCellDef="let breed">
                  {{breed.weight?.metric || 'N/A'}} kg
                </td>
              </ng-container>

              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef>Descripción</th>
                <td mat-cell *matCellDef="let breed" class="description-cell">
                  {{breed.description | slice:0:100}}{{breed.description?.length > 100 ? '...' : ''}}
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let breed">
                  <button 
                    mat-raised-button 
                    color="primary" 
                    size="small"
                    (click)="viewBreed(breed)"
                    class="action-button">
                    <mat-icon>visibility</mat-icon>
                    Ver Raza
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Sin resultados -->
      <div *ngIf="searchPerformed && !loading && searchResults.length === 0" class="no-results">
        <mat-card class="no-results-card">
          <mat-card-content>
            <div class="no-results-content">
              <mat-icon class="large-icon">search_off</mat-icon>
              <h2>Sin resultados</h2>
              <p>No se encontraron razas que coincidan con: <strong>"{{lastSearchTerm}}"</strong></p>
              <p class="suggestion">Intenta con otros términos como:</p>
              <div class="suggestions">
                <button mat-stroked-button (click)="suggestedSearch('persian')" class="suggestion-btn">Persian</button>
                <button mat-stroked-button (click)="suggestedSearch('siamese')" class="suggestion-btn">Siamese</button>
                <button mat-stroked-button (click)="suggestedSearch('maine')" class="suggestion-btn">Maine</button>
                <button mat-stroked-button (click)="suggestedSearch('active')" class="suggestion-btn">Active</button>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Error state -->
      <div *ngIf="errorMessage" class="error-container">
        <mat-card class="error-card">
          <mat-card-content>
            <div class="error-content">
              <mat-icon class="large-icon error">error</mat-icon>
              <h2>Error en la búsqueda</h2>
              <p>{{errorMessage}}</p>
              <button mat-raised-button color="primary" (click)="retrySearch()">
                <mat-icon>refresh</mat-icon>
                Intentar de nuevo
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      text-align: center;
      color: #333;
      margin-bottom: 30px;
    }

    .search-card {
      margin-bottom: 20px;
    }

    .search-form {
      display: flex;
      gap: 12px;
      align-items: end;
      flex-wrap: wrap;
    }

    .search-field {
      flex: 1;
      min-width: 300px;
    }

    .search-button, .clear-button {
      height: 48px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .search-button[disabled] {
      opacity: 0.7;
    }

    /* Estados informativos */
    .no-search-state, .loading-container, .no-results, .error-container {
      margin-top: 20px;
    }

    .info-content, .loading-content, .no-results-content, .error-content {
      text-align: center;
      padding: 40px 20px;
    }

    .large-icon {
      font-size: 72px;
      width: 72px;
      height: 72px;
      color: #666;
      margin-bottom: 16px;
    }

    .large-icon.error {
      color: #f44336;
    }

    .tip {
      background: #e3f2fd;
      color: #1976d2;
      padding: 12px;
      border-radius: 8px;
      margin-top: 16px;
      font-size: 14px;
    }

    .suggestions {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 16px;
    }

    .suggestion-btn {
      margin: 4px;
    }

    /* Tabla de resultados */
    .results-container {
      margin-top: 20px;
    }

    .results-count {
      color: #666;
      font-size: 14px;
      font-weight: normal;
    }

    .breeds-table {
      width: 100%;
      margin-top: 16px;
    }

    .breeds-table th {
      background-color: #f5f5f5;
      color: #333;
      font-weight: 600;
    }

    .breeds-table td {
      padding: 12px 8px;
      border-bottom: 1px solid #e0e0e0;
    }

    .temperament-cell {
      max-width: 200px;
      font-size: 14px;
    }

    .description-cell {
      max-width: 250px;
      font-size: 14px;
      line-height: 1.4;
    }

    .action-button {
      height: 36px;
      font-size: 12px;
      padding: 0 12px;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .search-container {
        padding: 10px;
      }

      .search-form {
        flex-direction: column;
        align-items: stretch;
      }

      .search-field {
        min-width: auto;
      }

      .search-button, .clear-button {
        width: 100%;
        justify-content: center;
      }

      .breeds-table {
        font-size: 12px;
      }

      .temperament-cell, .description-cell {
        max-width: 150px;
      }

      .suggestions {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class BreedListTableComponent {
  searchTerm = '';
  searchResults: CatBreed[] = [];
  loading = false;
  searchPerformed = false;
  lastSearchTerm = '';
  errorMessage = '';
  displayedColumns: string[] = ['name', 'origin', 'temperament', 'life_span', 'weight', 'description', 'actions'];

  constructor(
    private catUseCase: CatUseCase,
    private router: Router
  ) {}

  searchBreeds(): void {
    if (!this.searchTerm.trim()) {
      return;
    }

    this.loading = true;
    this.searchPerformed = true;
    this.lastSearchTerm = this.searchTerm.trim();
    this.errorMessage = '';
    
    this.catUseCase.searchBreeds(this.searchTerm.trim()).subscribe({
      next: (breeds) => {
        this.searchResults = breeds;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error buscando razas:', error);
        this.loading = false;
        this.errorMessage = 'Hubo un problema al buscar las razas. Por favor, intenta de nuevo.';
        this.searchResults = [];
      }
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchResults = [];
    this.searchPerformed = false;
    this.lastSearchTerm = '';
    this.errorMessage = '';
  }

  suggestedSearch(term: string): void {
    this.searchTerm = term;
    this.searchBreeds();
  }

  retrySearch(): void {
    if (this.lastSearchTerm) {
      this.searchTerm = this.lastSearchTerm;
      this.searchBreeds();
    }
  }

  viewBreed(breed: CatBreed): void {
    // Navegar a la vista de detalles de raza con el ID de la raza
    this.router.navigate(['/breeds'], { 
      queryParams: { breedId: breed.id } 
    });
  }
}