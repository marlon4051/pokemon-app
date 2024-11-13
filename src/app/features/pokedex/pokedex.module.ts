import { NgModule } from '@angular/core';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { PokemonCardComponent } from './components/pokemon-card/pokemon-card.component';
import { PokedexHomeComponent } from './components/pokedex-home/pokedex-home.component';
import { PokemonService } from './services/pokemon.service';
import { CommonModule } from '@angular/common';
import { InMemoryCache, HttpLink } from '@apollo/client/core';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';


@NgModule({
  declarations: [PokemonListComponent, PokemonCardComponent, PokedexHomeComponent],
  providers: [
    PokemonService,
    {
      provide: APOLLO_OPTIONS,
      useFactory: () => {
        return {
          cache: new InMemoryCache(),
          link: new HttpLink({ uri: 'https://beta.pokeapi.co/graphql/v1beta' }),
        };
      },
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
  imports: [CommonModule, ApolloModule, InfiniteScrollDirective],
})
export class PokedexModule {}
