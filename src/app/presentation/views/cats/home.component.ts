import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CatUseCase } from '../../../application/use-cases/cat.usecase';
import { CatBreed } from '../../../domain/models/cat-breed.model';
import { CatImage } from '../../../domain/models/image.model';
import { CatCarouselComponent } from '../../components/cat-carousel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatButtonModule,
    CatCarouselComponent
  ],
  template: `
    <div class="home-container">
      <h1>Bienvenido a Cat Breeds App</h1>
      
      <mat-card class="breed-selector-card">
        <mat-card-header>
          <mat-card-title>Selecciona una Raza</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field appearance="fill" class="breed-select">
            <mat-label>Raza de Gato</mat-label>
            <mat-select 
              [(value)]="selectedBreedId" 
              (selectionChange)="onBreedSelected($event.value)"
              [disabled]="loading">
              <mat-option value="">-- Selecciona una raza --</mat-option>
              <mat-option 
                *ngFor="let breed of breeds" 
                [value]="breed.id">
                {{breed.name}}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </mat-card-content>
      </mat-card>

      <div *ngIf="selectedBreed" class="breed-info">
        <mat-card>
          <mat-card-header>
            <mat-card-title>{{selectedBreed.name}}</mat-card-title>
            <mat-card-subtitle>{{selectedBreed.origin}}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p><strong>Descripción:</strong> {{selectedBreed.description}}</p>
            <p><strong>Temperamento:</strong> {{selectedBreed.temperament}}</p>
            <p><strong>Esperanza de vida:</strong> {{selectedBreed.life_span}} años</p>
            <p *ngIf="selectedBreed.weight"><strong>Peso:</strong> {{selectedBreed.weight.metric}} kg</p>
          </mat-card-content>
        </mat-card>
      </div>

      <div *ngIf="loadingImages" class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Cargando imágenes...</p>
      </div>

      <div *ngIf="breedImages.length > 0" class="carousel-container">
        <h2>Imágenes de {{selectedBreed?.name}}</h2>
        <app-cat-carousel [images]="breedImages"></app-cat-carousel>
      </div>

      <div *ngIf="breeds.length > 0" class="breeds-table-container">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Tabla de Razas de Gatos</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="breeds" class="breeds-table">
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
                <td mat-cell *matCellDef="let breed">{{breed.temperament | slice:0:50}}{{breed.temperament.length > 50 ? '...' : ''}}</td>
              </ng-container>

              <ng-container matColumnDef="life_span">
                <th mat-header-cell *matHeaderCellDef>Esperanza de Vida</th>
                <td mat-cell *matCellDef="let breed">{{breed.life_span}} años</td>
              </ng-container>

              <ng-container matColumnDef="weight">
                <th mat-header-cell *matHeaderCellDef>Peso</th>
                <td mat-cell *matCellDef="let breed">{{breed.weight?.metric || 'N/A'}} kg</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let breed">
                  <button mat-button color="primary" (click)="selectBreedFromTable(breed.id)">
                    <i class="material-icons">visibility</i>
                    Ver
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </mat-card-content>
        </mat-card>
      </div>

      <div *ngIf="!loading && breeds.length === 0" class="no-data">
        <mat-card>
          <mat-card-content>
            <p>No se pudieron cargar las razas. Intenta recargar la página.</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      text-align: center;
      color: #3f51b5;
      margin-bottom: 30px;
    }

    .breed-selector-card {
      margin-bottom: 20px;
    }

    .breed-select {
      width: 100%;
      min-width: 300px;
    }

    .breed-info {
      margin: 20px 0;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
    }

    .carousel-container {
      margin-top: 30px;
    }

    .carousel-container h2 {
      text-align: center;
      margin-bottom: 20px;
      color: #3f51b5;
    }

    .breeds-table-container {
      margin-top: 30px;
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

    .no-data {
      text-align: center;
      margin-top: 40px;
    }

    /* Estilos para mat-option - fondo sólido */
    ::ng-deep .mat-mdc-option {
      background-color: white !important;
      color: #333 !important;
    }

    ::ng-deep .mat-mdc-option:hover {
      background-color: #f5f5f5 !important;
    }

    ::ng-deep .mat-mdc-option.mdc-list-item--selected {
      background-color: #e3f2fd !important;
      color: #1976d2 !important;
    }

    ::ng-deep .mat-mdc-option.mat-mdc-option-active {
      background-color: #e8f4fd !important;
    }

    ::ng-deep .mat-mdc-select-panel {
      background-color: white !important;
      border: 1px solid #ddd;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    @media (max-width: 768px) {
      .home-container {
        padding: 10px;
      }
      
      .breed-select {
        min-width: 250px;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  breeds: CatBreed[] = [];
  selectedBreedId = '';
  selectedBreed: CatBreed | null = null;
  breedImages: CatImage[] = [];
  loading = false;
  loadingImages = false;
  displayedColumns: string[] = ['name', 'origin', 'temperament', 'life_span', 'weight', 'actions'];

  constructor(private catUseCase: CatUseCase) {}

  ngOnInit(): void {
    this.loadBreeds();
  }

  private loadBreeds(): void {
    this.loading = true;
    this.catUseCase.getAllBreeds().subscribe({
      next: (breeds) => {
        this.breeds = breeds;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando razas:', error);
        this.loading = false;
      }
    });
  }

  onBreedSelected(breedId: string): void {
    if (!breedId) {
      this.selectedBreed = null;
      this.breedImages = [];
      return;
    }

    this.selectedBreed = this.breeds.find(breed => breed.id === breedId) || null;
    
    if (this.selectedBreed) {
      this.loadBreedImages(breedId);
    }
  }

  private loadBreedImages(breedId: string): void {
    this.loadingImages = true;
    this.breedImages = [];
    
    this.catUseCase.getImagesByBreedId(breedId).subscribe({
      next: (images) => {
        this.breedImages = images;
        this.loadingImages = false;
      },
      error: (error) => {
        console.error('Error cargando imágenes:', error);
        this.loadingImages = false;
      }
    });
  }

  selectBreedFromTable(breedId: string): void {
    this.selectedBreedId = breedId;
    this.onBreedSelected(breedId);
    
    // Scroll to breed info section
    setTimeout(() => {
      const breedInfoElement = document.querySelector('.breed-info');
      if (breedInfoElement) {
        breedInfoElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
}