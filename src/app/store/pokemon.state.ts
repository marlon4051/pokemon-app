import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Pokemon } from '../models/pokemon.model';
import { PokemonService } from '../features/pokedex/services/pokemon.service';
import { catchError, of, tap } from 'rxjs';

export class LoadPokemons {
  static readonly type = '[Pokemon] Load';
  constructor(public offset: number = 0) {}
}

export class LoadMorePokemons {
  static readonly type = '[Pokemon] Load More';
}

export interface PokemonStateModel {
  pokemons: Pokemon[];
  loading: boolean;
  error: string | null;
  offset: number;
  hasMorePokemons: boolean;
}

@State<PokemonStateModel>({
  name: 'pokemon',
  defaults: {
    pokemons: [],
    loading: false,
    error: null,
    offset: 0,
    hasMorePokemons: true,
  },
})
@Injectable()
export class PokemonState {
  constructor(private pokemonService: PokemonService) {}

  @Selector()
  static pokemons(state: PokemonStateModel) {
    return state.pokemons;
  }

  @Selector()
  static loading(state: PokemonStateModel) {
    return state.loading;
  }

  // Load initial pokemons
  @Action(LoadPokemons)
  loadPokemons(ctx: StateContext<PokemonStateModel>, action: LoadPokemons) {
    const state = ctx.getState();
    ctx.patchState({
      loading: true,
      error: null,
      offset: action.offset,
    });

    return this.pokemonService.getPokemonList(20, action.offset).pipe(
      tap((pokemons: Pokemon[]) => {
        ctx.patchState({
          pokemons: state.pokemons.concat(pokemons),
          loading: false,
          offset: state.offset + 20,
          hasMorePokemons: pokemons.length === 20,
        });
      }),
      catchError((error) => {
        ctx.patchState({
          loading: false,
          error: error.message,
        });
        return of([]);
      })
    );
  }

  // Load more pokemons for infinite scroll
  @Action(LoadMorePokemons)
  loadMorePokemons(ctx: StateContext<PokemonStateModel>) {
    const state = ctx.getState();
    return ctx.dispatch(new LoadPokemons(state.offset));
  }
}
