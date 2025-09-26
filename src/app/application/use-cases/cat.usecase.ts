import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CatRepository } from '../../domain/abstractions/cat-repository.abstract';
import { CatBreed } from '../../domain/models/cat-breed.model';
import { CatImage } from '../../domain/models/image.model';

@Injectable({
  providedIn: 'root'
})
export class CatUseCase {
  constructor(private catRepository: CatRepository) {}

  getAllBreeds(): Observable<CatBreed[]> {
    return this.catRepository.getAllBreeds();
  }

  getBreedById(breedId: string): Observable<CatBreed> {
    return this.catRepository.getBreedById(breedId);
  }

  searchBreeds(query: string): Observable<CatBreed[]> {
    if (!query.trim()) {
      return this.getAllBreeds();
    }
    return this.catRepository.searchBreeds(query);
  }

  getImagesByBreedId(breedId: string): Observable<CatImage[]> {
    return this.catRepository.getImagesByBreedId(breedId);
  }

  filterBreedsByName(breeds: CatBreed[], searchTerm: string): CatBreed[] {
    if (!searchTerm.trim()) {
      return breeds;
    }
    return breeds.filter(breed => 
      breed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      breed.temperament.toLowerCase().includes(searchTerm.toLowerCase()) ||
      breed.origin.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}