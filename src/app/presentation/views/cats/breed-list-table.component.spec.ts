import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BreedListTableComponent } from './breed-list-table.component';
import { CatUseCase } from '../../../application/use-cases/cat.usecase';
import { CatBreed } from '../../../domain/models/cat-breed.model';

describe('BreedListTableComponent', () => {
  let component: BreedListTableComponent;
  let fixture: ComponentFixture<BreedListTableComponent>;
  let mockCatUseCase: jasmine.SpyObj<CatUseCase>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockBreeds: CatBreed[] = [
    {
      id: 'pers',
      name: 'Persian',
      origin: 'Iran',
      temperament: 'Quiet, Gentle',
      description: 'The Persian is a long-haired breed of cat...',
      life_span: '10 - 17',
      weight: { metric: '3 - 6', imperial: '7 - 13' }
    },
    {
      id: 'siam',
      name: 'Siamese',
      origin: 'Thailand',
      temperament: 'Active, Playful',
      description: 'The Siamese cat is one of the first...',
      life_span: '12 - 15',
      weight: { metric: '3 - 5', imperial: '7 - 11' }
    }
  ];

  beforeEach(async () => {
    const catUseCaseSpy = jasmine.createSpyObj('CatUseCase', ['searchBreeds']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        BreedListTableComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: CatUseCase, useValue: catUseCaseSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BreedListTableComponent);
    component = fixture.componentInstance;
    mockCatUseCase = TestBed.inject(CatUseCase) as jasmine.SpyObj<CatUseCase>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty search state', () => {
    expect(component.searchTerm).toBe('');
    expect(component.searchResults).toEqual([]);
    expect(component.loading).toBeFalse();
    expect(component.searchPerformed).toBeFalse();
    expect(component.errorMessage).toBe('');
  });

  it('should not search when search term is empty', () => {
    component.searchTerm = '';
    component.searchBreeds();

    expect(mockCatUseCase.searchBreeds).not.toHaveBeenCalled();
    expect(component.searchPerformed).toBeFalse();
  });

  it('should search breeds when search term is provided', () => {
    const searchTerm = 'persian';
    mockCatUseCase.searchBreeds.and.returnValue(of(mockBreeds));

    component.searchTerm = searchTerm;
    component.searchBreeds();

    expect(mockCatUseCase.searchBreeds).toHaveBeenCalledWith(searchTerm);
    expect(component.loading).toBeFalse();
    expect(component.searchPerformed).toBeTrue();
    expect(component.lastSearchTerm).toBe(searchTerm);
    expect(component.searchResults).toEqual(mockBreeds);
    expect(component.errorMessage).toBe('');
  });

  it('should handle search errors', () => {
    const searchTerm = 'persian';
    mockCatUseCase.searchBreeds.and.returnValue(throwError(() => new Error('Search failed')));

    component.searchTerm = searchTerm;
    component.searchBreeds();

    expect(mockCatUseCase.searchBreeds).toHaveBeenCalledWith(searchTerm);
    expect(component.loading).toBeFalse();
    expect(component.searchPerformed).toBeTrue();
    expect(component.searchResults).toEqual([]);
    expect(component.errorMessage).toContain('Hubo un problema al buscar las razas');
  });

  it('should clear search results and state', () => {
    // Setup initial state
    component.searchTerm = 'persian';
    component.searchResults = mockBreeds;
    component.searchPerformed = true;
    component.lastSearchTerm = 'persian';
    component.errorMessage = 'some error';

    component.clearSearch();

    expect(component.searchTerm).toBe('');
    expect(component.searchResults).toEqual([]);
    expect(component.searchPerformed).toBeFalse();
    expect(component.lastSearchTerm).toBe('');
    expect(component.errorMessage).toBe('');
  });

  it('should perform suggested search', () => {
    const suggestedTerm = 'siamese';
    mockCatUseCase.searchBreeds.and.returnValue(of(mockBreeds));

    component.suggestedSearch(suggestedTerm);

    expect(component.searchTerm).toBe(suggestedTerm);
    expect(mockCatUseCase.searchBreeds).toHaveBeenCalledWith(suggestedTerm);
  });

  it('should retry last search', () => {
    const lastSearch = 'persian';
    component.lastSearchTerm = lastSearch;
    mockCatUseCase.searchBreeds.and.returnValue(of(mockBreeds));

    component.retrySearch();

    expect(component.searchTerm).toBe(lastSearch);
    expect(mockCatUseCase.searchBreeds).toHaveBeenCalledWith(lastSearch);
  });

  it('should navigate to breed details when viewing a breed', () => {
    const breed = mockBreeds[0];

    component.viewBreed(breed);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/breeds'], {
      queryParams: { breedId: breed.id }
    });
  });

  it('should search by name, origin or temperament', () => {
    // Test that the search functionality is calling the correct use case method
    // which connects to the backend endpoint that searches by name, origin, or temperament
    const searchTerms = ['Persian', 'Egypt', 'Active'];
    
    searchTerms.forEach(term => {
      mockCatUseCase.searchBreeds.and.returnValue(of(mockBreeds));
      component.searchTerm = term;
      component.searchBreeds();
      
      expect(mockCatUseCase.searchBreeds).toHaveBeenCalledWith(term);
    });

    expect(mockCatUseCase.searchBreeds).toHaveBeenCalledTimes(3);
  });
});