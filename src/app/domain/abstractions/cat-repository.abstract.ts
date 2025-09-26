import { Observable } from 'rxjs';
import { CatBreed } from '../models/cat-breed.model';
import { CatImage } from '../models/image.model';

export abstract class CatRepository {
  abstract getAllBreeds(): Observable<CatBreed[]>;
  abstract getBreedById(breedId: string): Observable<CatBreed>;
  abstract searchBreeds(query: string): Observable<CatBreed[]>;
  abstract getImagesByBreedId(breedId: string): Observable<CatImage[]>;
}