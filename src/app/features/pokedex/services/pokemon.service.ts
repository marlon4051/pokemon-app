import { Injectable } from '@angular/core';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { Pokemon } from '../../../models/pokemon.model';
import { Observable } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

const GET_POKEMONS = gql`
  query GetPokemons($limit: Int, $offset: Int) {
    pokemon_v2_pokemonspecies(
      limit: $limit
      offset: $offset
      order_by: { id: asc }
    ) {
      pokemon_v2_pokemons {
        name
        height
        weight
        pokemon_v2_pokemonsprites {
          sprites(path: "other.official-artwork.front_default")
        }
      }
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class PokemonService {
  constructor(private apollo: Apollo) {}
  getPokemonList(limit: number, offset: number): Observable<Pokemon[]> {
    return this.apollo
      .watchQuery<any>({
        query: GET_POKEMONS,
        variables: { limit, offset },
      })
      .valueChanges.pipe(
        debounceTime(300),
        switchMap(() => {
          return this.apollo.watchQuery<any>({
            query: GET_POKEMONS,
            variables: { limit, offset },
          }).valueChanges;
        }),
        map((result) => {
          return result.data.pokemon_v2_pokemonspecies.map((item: any) => ({
            name: item.pokemon_v2_pokemons[0]?.name,
            height: item.pokemon_v2_pokemons[0]?.height,
            weight: item.pokemon_v2_pokemons[0]?.weight,
            imageUrl:
              item.pokemon_v2_pokemons[0]?.pokemon_v2_pokemonsprites[0]
                ?.sprites,
          })) as Pokemon[];
        })
      );
  }

  //   getPokemonList() {
  // return this.http.get<Pokemon[]>(this.apiUrl).pipe(
  //     switchMap((response: any) => {
  //       const pokemonDetails = response.results.map((pokemon: any) =>
  //         this.http.get(pokemon.url)
  //       );
  //       return forkJoin(pokemonDetails);
  //     })
  //   );
  //   }
}
