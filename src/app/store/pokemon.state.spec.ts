import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { LoadMorePokemons, PokemonState } from './pokemon.state';
import { PokemonService } from '../features/pokedex/services/pokemon.service';
import { LoadPokemons } from './pokemon.state';
import { of, throwError } from 'rxjs';
import { Pokemon } from '../models/pokemon.model';

describe('PokemonState', () => {
  let store: Store;
  let pokemonServiceSpy: jasmine.SpyObj<PokemonService>;

  beforeEach(() => {
    pokemonServiceSpy = jasmine.createSpyObj('PokemonService', [
      'getPokemonList',
    ]);
    pokemonServiceSpy.getPokemonList.and.returnValue(of([]));
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([PokemonState])],
      providers: [{ provide: PokemonService, useValue: pokemonServiceSpy }],
    });
    store = TestBed.inject(Store);
  });

  it('should load and update pokemons correctly on LoadPokemons', () => {
    const mockPokemons: Pokemon[] = [
      { name: 'Pikachu1', imageUrl: 'url', height: 1, weight: 2 },
    ];
    pokemonServiceSpy.getPokemonList.and.returnValue(of(mockPokemons));

    store.dispatch(new LoadPokemons(0));

    store.selectOnce(PokemonState.pokemons).subscribe((pokemons) => {
      expect(pokemons.length).toBeGreaterThan(0);
      expect(pokemons[0].name).toEqual('Pikachu1');
    });

    store.selectOnce(PokemonState.loading).subscribe((loading) => {
      expect(loading).toBe(false);
    });
  });

  it('should handle error and not update pokemons on error', () => {
    const errorMessage = 'Error loading pokemons';
    pokemonServiceSpy.getPokemonList.and.returnValue(
      throwError(() => new Error(errorMessage))
    );

    store.dispatch(new LoadPokemons(0));

    store.selectOnce(PokemonState.pokemons).subscribe((pokemons) => {
      expect(pokemons.length).toBe(0);
    });

    store.selectOnce(PokemonState.error).subscribe((error) => {
      expect(error).toEqual('Error loading pokemons');
    });
  });

  it('should trigger LoadPokemons when LoadMorePokemons is called', () => {
    const dispatchSpy = jasmine.createSpy('dispatch');
    const stateContextMock = {
      getState: jasmine.createSpy('getState').and.returnValue({ offset: 0 }),
      dispatch: dispatchSpy,
    };
    const pokemonState = new PokemonState(pokemonServiceSpy);
  
    // Trigger the loadMorePokemons action
    pokemonState.loadMorePokemons(stateContextMock as any);
  
    expect(dispatchSpy).toHaveBeenCalledTimes(1);  // Only one internal dispatch (LoadPokemons)
    expect(dispatchSpy).toHaveBeenCalledWith(jasmine.any(LoadPokemons));  // Dispatch LoadPokemons when call loadMorePokemons
  });
  
  
  
});
