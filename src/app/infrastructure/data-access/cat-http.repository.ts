import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatRepository } from '../../domain/abstractions/cat-repository.abstract';
import { CatBreed } from '../../domain/models/cat-breed.model';
import { CatImage } from '../../domain/models/image.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatHttpRepository extends CatRepository {
  private readonly baseUrl = environment.backendUrl;

  constructor(private http: HttpClient) {
    super();
  }

  getAllBreeds(): Observable<CatBreed[]> {
    return this.http.get<CatBreed[]>(`${this.baseUrl}/cats/breeds`);
  }

  getBreedById(breedId: string): Observable<CatBreed> {
    return this.http.get<CatBreed>(`${this.baseUrl}/cats/breeds/${breedId}`);
  }

  searchBreeds(query: string): Observable<CatBreed[]> {
    return this.http.get<CatBreed[]>(`${this.baseUrl}/cats/breeds/search?q=${query}`);
  }

  getImagesByBreedId(breedId: string): Observable<CatImage[]> {
    return this.http.get<CatImage[]>(`${this.baseUrl}/images/imagesbybreedid?breed_id=${breedId}&limit=10`);
  }
}