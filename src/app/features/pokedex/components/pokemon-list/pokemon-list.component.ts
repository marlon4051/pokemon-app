import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Pokemon } from '../../../../models/pokemon.model';
import {
  LoadMorePokemons,
  LoadPokemons,
} from '../../../../store/pokemon.state';

@Component({
  selector: 'app-pokemon-list',
  styleUrl: './pokemon-list.component.scss',
  templateUrl: './pokemon-list.component.html',
})
export class PokemonListComponent implements OnInit {
  public pokemons$: Observable<Pokemon[]> | undefined;
  public loading$: Observable<boolean> | undefined;
  public error$: Observable<string> | undefined;
  public hasMorePokemons$: Observable<boolean> | undefined;

  constructor(private store: Store) {}

  public ngOnInit(): void {
    this.store.dispatch(new LoadPokemons());

    this.pokemons$ = this.store.select((state) => state.pokemon.pokemons);
    this.loading$ = this.store.select((state) => state.pokemon.loading);
    this.error$ = this.store.select((state) => state.pokemon.error);
    this.hasMorePokemons$ = this.store.select((state) => state.pokemon.hasMorePokemons);
  }

  public onScroll(): void {
    // Load more Pokémon when scrolled
    this.hasMorePokemons$?.subscribe((hasMore) => {
      if (hasMore) {
        this.store.dispatch(new LoadMorePokemons());
      }
    });
  }
}
