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

  // it('should trigger LoadPokemons on LoadMorePokemons with updated offset', () => {
  //   const dispatchSpy = spyOn(store, 'dispatch').and.callThrough(); // Espiar el método dispatch del store

  //   store.dispatch(new LoadPokemons(0)); // Acción inicial con offset 0
  //   store.dispatch(new LoadMorePokemons()); // Acción para cargar más pokemons

  //   // Verifica que dispatch haya sido llamado con una acción LoadPokemons que contenga el offset actualizado
  //   expect(dispatchSpy).toHaveBeenCalledWith(
  //     jasmine.objectContaining({ offset: 20 })
  //   );
  // });
});
