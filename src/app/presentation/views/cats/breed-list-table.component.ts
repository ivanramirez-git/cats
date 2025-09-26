import { Component, OnInit } from '@angular/core';
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
        </mat-card-header>
        <mat-card-content>
          <div class="search-form">
            <mat-form-field appearance="fill" class="search-field">
              <mat-label>Buscar por nombre, origen o temperamento</mat-label>
              <input 
                matInput 
                [(ngModel)]="searchTerm" 
                (keyup.enter)="searchBreeds()"
                placeholder="Ingresa texto para buscar...">
              <i class="material-icons" matSuffix>search</i>
            </mat-form-field>
            <button 
              mat-raised-button 
              color="primary" 
              (click)="searchBreeds()"
              [disabled]="loading"
              class="search-button">
              <i class="material-icons">search</i>
              Buscar
            </button>
            <button 
              mat-button 
              color="accent" 
              (click)="clearSearch()"
              [disabled]="loading"
              class="clear-button">
              <i class="material-icons">clear</i>
              Limpiar
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <div *ngIf="loading" class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Buscando razas...</p>
      </div>

      <div *ngIf="filteredBreeds.length > 0" class="results-container">
        <mat-card>
          <mat-card-header>
            <mat-card-title>
              Resultados de Búsqueda 
              <span class="results-count">({{filteredBreeds.length}} encontradas)</span>
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="filteredBreeds" class="breeds-table">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let breed">{{breed.name}}</td>
              </ng-container>

              <ng-container matColumnDef="origin">
                <th mat-header-cell *matHeaderCellDef>Origen</th>
                <td mat-cell *matCellDef="let breed">{{breed.origin}}</td>
              </ng-container>

              <ng-container matColumnDef="temperament">
                <th mat-header-cell *matHeaderCellDef>Temperamento</th>
                <td mat-cell *matCellDef="let breed">{{breed.temperament}}</td>
              </ng-container>

              <ng-container matColumnDef="life_span">
                <th mat-header-cell *matHeaderCellDef>Esperanza de Vida</th>
                <td mat-cell *matCellDef="let breed">{{breed.life_span}} años</td>
              </ng-container>

              <ng-container matColumnDef="weight">
                <th mat-header-cell *matHeaderCellDef>Peso</th>
                <td mat-cell *matCellDef="let breed">{{breed.weight?.metric || 'N/A'}} kg</td>
              </ng-container>

              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef>Descripción</th>
                <td mat-cell *matCellDef="let breed">
                  {{breed.description | slice:0:100}}{{breed.description.length > 100 ? '...' : ''}}
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let breed">
                  <button 
                    mat-raised-button 
                    color="primary" 
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

      <div *ngIf="!loading && searchPerformed && filteredBreeds.length === 0" class="no-results">
        <mat-card>
          <mat-card-content>
            <div class="no-results-content">
              <i class="material-icons">search_off</i>
              <h3>No se encontraron resultados</h3>
              <p>No hay razas que coincidan con "{{searchTerm}}". Intenta con otros términos de búsqueda.</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div *ngIf="!loading && !searchPerformed" class="initial-state">
        <mat-card>
          <mat-card-content>
            <div class="initial-content">
              <i class="material-icons">info</i>
              <h3>Buscar Razas de Gatos</h3>
              <p>Utiliza el campo de búsqueda para encontrar razas por nombre, origen o temperamento.</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      
    </div>
  `,
  styles: [`
    .search-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      text-align: center;
      color: #3f51b5;
      margin-bottom: 30px;
    }

    .search-card {
      margin-bottom: 20px;
    }

    .search-form {
      display: flex;
      gap: 15px;
      align-items: flex-end;
      flex-wrap: wrap;
    }

    .search-field {
      flex: 1;
      min-width: 300px;
    }

    .search-button, .clear-button {
      height: 56px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
    }

    .results-container {
      margin-top: 20px;
    }

    .results-count {
      font-size: 0.9em;
      color: #666;
      font-weight: normal;
    }

    .breeds-table {
      width: 100%;
    }

    .breeds-table th {
      font-weight: bold;
      color: #3f51b5;
    }

    .breeds-table td, .breeds-table th {
      padding: 12px 8px;
    }

    .no-results, .initial-state {
      margin-top: 40px;
      text-align: center;
    }

    .no-results-content, .initial-content {
      padding: 40px;
    }

    .no-results-content i, .initial-content i {
      font-size: 48px;
      color: #999;
      margin-bottom: 16px;
    }

    .no-results-content h3, .initial-content h3 {
      margin: 16px 0;
      color: #333;
    }

    .no-results-content p, .initial-content p {
      color: #666;
      margin: 0;
    }

    .mat-column-actions {
      width: 120px;
      text-align: center;
    }

    .action-button {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      padding: 8px 12px;
    }

    .action-button mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

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
        height: 48px;
      }

      .action-button {
        font-size: 10px;
        padding: 6px 8px;
      }
    }
  `]
})
export class BreedListTableComponent implements OnInit {
  allBreeds: CatBreed[] = [];
  filteredBreeds: CatBreed[] = [];
  searchTerm = '';
  loading = false;
  searchPerformed = false;
  displayedColumns: string[] = ['name', 'origin', 'temperament', 'life_span', 'weight', 'description', 'actions'];

  constructor(
    private catUseCase: CatUseCase,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllBreeds();
  }

  private loadAllBreeds(): void {
    this.loading = true;
    this.catUseCase.getAllBreeds().subscribe({
      next: (breeds) => {
        this.allBreeds = breeds;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando razas:', error);
        this.loading = false;
      }
    });
  }

  searchBreeds(): void {
    if (!this.searchTerm.trim()) {
      this.filteredBreeds = [];
      this.searchPerformed = false;
      return;
    }

    this.loading = true;
    this.searchPerformed = true;
    
    // Simulate search delay for better UX
    setTimeout(() => {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredBreeds = this.allBreeds.filter(breed => 
        breed.name.toLowerCase().includes(term) ||
        breed.origin.toLowerCase().includes(term) ||
        breed.temperament.toLowerCase().includes(term)
      );
      this.loading = false;
    }, 500);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredBreeds = [];
    this.searchPerformed = false;
  }

  viewBreed(breed: CatBreed): void {
    // Navegar a la vista de detalles de raza con el ID de la raza
    this.router.navigate(['/breeds'], { 
      queryParams: { breedId: breed.id } 
    });
  }
}