import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CatImage } from '../../domain/models/image.model';

@Component({
  selector: 'app-cat-carousel',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="carousel-container" *ngIf="images && images.length > 0">
      <mat-card class="carousel-card">
        <div class="carousel-content">
          <button 
            mat-icon-button 
            class="nav-button prev" 
            (click)="previousImage()"
            [disabled]="images.length <= 1">
            <mat-icon>chevron_left</mat-icon>
          </button>
          
          <div class="image-container">
            <img 
              [src]="images[currentIndex]?.url" 
              [alt]="'Imagen de gato ' + (currentIndex + 1)"
              class="carousel-image"
              (error)="onImageError($event)">
          </div>
          
          <button 
            mat-icon-button 
            class="nav-button next" 
            (click)="nextImage()"
            [disabled]="images.length <= 1">
            <mat-icon>chevron_right</mat-icon>
          </button>
        </div>
        
        <div class="indicators" *ngIf="images.length > 1">
          <button 
            *ngFor="let image of images; let i = index"
            class="indicator"
            [class.active]="i === currentIndex"
            (click)="goToImage(i)">
          </button>
        </div>
        
        <mat-card-content class="image-info">
          <p>Imagen {{currentIndex + 1}} de {{images.length}}</p>
        </mat-card-content>
      </mat-card>
    </div>
    
    <div *ngIf="!images || images.length === 0" class="no-images">
      <mat-card>
        <mat-card-content>
          <p>No hay imágenes disponibles</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .carousel-container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .carousel-card {
      padding: 16px;
    }
    
    .carousel-content {
      display: flex;
      align-items: center;
      position: relative;
    }
    
    .image-container {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;
      max-height: 400px;
      overflow: hidden;
    }
    
    .carousel-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      border-radius: 8px;
    }
    
    .nav-button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 2;
      background: rgba(0, 0, 0, 0.5);
      color: white;
    }
    
    .nav-button.prev {
      left: 8px;
    }
    
    .nav-button.next {
      right: 8px;
    }
    
    .indicators {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 16px;
    }
    
    .indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: none;
      background: #ccc;
      cursor: pointer;
      transition: background 0.3s;
    }
    
    .indicator.active {
      background: #3f51b5;
    }
    
    .image-info {
      text-align: center;
      margin-top: 8px;
    }
    
    .no-images {
      text-align: center;
      color: #666;
    }
  `]
})
export class CatCarouselComponent implements OnInit {
  @Input() images: CatImage[] = [];
  currentIndex = 0;

  ngOnInit(): void {
    this.currentIndex = 0;
  }

  nextImage(): void {
    if (this.images.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }
  }

  previousImage(): void {
    if (this.images.length > 0) {
      this.currentIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
    }
  }

  goToImage(index: number): void {
    this.currentIndex = index;
  }

  onImageError(event: any): void {
    console.error('Error cargando imagen:', event);
  }
}