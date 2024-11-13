import { TestBed } from '@angular/core/testing';
import { PokemonService } from './pokemon.service';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

// // Mock Pokemon data that would come from the GraphQL response
// const mockPokemonData = [
//   {
//     name: 'Bulbasaur',
//     height: 7,
//     weight: 69,
//     imageUrl: 'https://some-image-url.com/bulbasaur.png',
//   },
//   {
//     name: 'Ivysaur',
//     height: 10,
//     weight: 130,
//     imageUrl: 'https://some-image-url.com/ivysaur.png',
//   },
// ];

describe('PokemonService', () => {
  let service: PokemonService;
  let apolloSpy: jasmine.SpyObj<Apollo>;

  beforeEach(() => {
    apolloSpy = jasmine.createSpyObj('Apollo', ['watchQuery']);
    apolloSpy.watchQuery.and.returnValue({
      valueChanges: of({
        data: {
          pokemon_v2_pokemonspecies: [
            {
              pokemon_v2_pokemons: [
                {
                  name: 'Bulbasaur',
                  height: 7,
                  weight: 69,
                  pokemon_v2_pokemonsprites: [
                    { sprites: 'https://some-image-url.com/bulbasaur.png' },
                  ],
                },
              ],
            },
            {
              pokemon_v2_pokemons: [
                {
                  name: 'Ivysaur',
                  height: 10,
                  weight: 130,
                  pokemon_v2_pokemonsprites: [
                    { sprites: 'https://some-image-url.com/ivysaur.png' },
                  ],
                },
              ],
            },
          ],
        },
      }),
    } as any);

    TestBed.configureTestingModule({
      providers: [PokemonService, { provide: Apollo, useValue: apolloSpy }],
    });

    service = TestBed.inject(PokemonService);
  });

  it('should return a list of pokemons with the correct data', (done) => {
    service.getPokemonList(20, 0).subscribe((pokemons) => {
      expect(pokemons.length).toBe(2);
      expect(pokemons[0].name).toBe('Bulbasaur');
      expect(pokemons[1].imageUrl).toBe(
        'https://some-image-url.com/ivysaur.png'
      );
      done();
    });

    // Ensure that Apollo's watchQuery was called with the correct parameters
    expect(apolloSpy.watchQuery).toHaveBeenCalledWith({
      query: jasmine.anything(),
      variables: { limit: 20, offset: 0 },
    });
  });
});
