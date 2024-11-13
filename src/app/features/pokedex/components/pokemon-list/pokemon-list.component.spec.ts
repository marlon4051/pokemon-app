import { of, throwError } from "rxjs";
import { LoadMorePokemons, LoadPokemons, PokemonState } from "../../../../store/pokemon.state";
import { PokemonListComponent } from "./pokemon-list.component";
import { NgxsModule, Store } from "@ngxs/store";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Apollo } from "apollo-angular";

describe('PokemonListComponent', () => {
  let component: PokemonListComponent;
  let store: jasmine.SpyObj<Store>;
  let toastr: jasmine.SpyObj<ToastrService>;
  let fixture: ComponentFixture<PokemonListComponent>;

  beforeEach(async () => {
    store = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    toastr = jasmine.createSpyObj('ToastrService', ['error']);
    const mockApollo = {
      watchQuery: jasmine.createSpy().and.returnValue({
        valueChanges: of({
          data: {
            pokemon_v2_pokemonspecies: [
              {
                pokemon_v2_pokemons: [
                  { name: 'Pikachu', height: 0.4, weight: 6 },
                ],
              },
            ],
          },
        }),
      }),
    };

    await TestBed.configureTestingModule({
      declarations: [PokemonListComponent],
      imports: [NgxsModule.forRoot([PokemonState]), ToastrModule.forRoot()],
      providers: [
        { provide: Store, useValue: store },
        { provide: ToastrService, useValue: toastr },
        { provide: Apollo, useValue: mockApollo },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should dispatch LoadPokemons on initialization', () => {
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(new LoadPokemons(0));
  });

  it('should select the pokemons from the store', () => {
    const pokemonsMock$ = of([{ name: 'Bulbasaur' }]);
    store.select.and.returnValue(pokemonsMock$);

    component.ngOnInit();
    component.pokemons$?.subscribe((pokemons: any[]) => {
      expect(pokemons.length).toBe(1);
      expect(pokemons[0].name).toBe('Bulbasaur');
    });
  });

  it('should show error toast on error$', () => {
    const errorMessage = 'Error loading pokemons';
    store.select.and.returnValue(throwError(() => new Error(errorMessage)));

    component.ngOnInit();
    expect(toastr.error).toHaveBeenCalledWith(
      'Failed to load pokemons',
      'Error loading pokemons'
    );
  });

  it('should dispatch LoadMorePokemons on scroll if there are more pokemons', () => {
    const hasMoreMock$ = of(true);
    store.select.and.returnValue(hasMoreMock$);

    component.onScroll();
    expect(store.dispatch).toHaveBeenCalledWith(new LoadMorePokemons());
  });

  it('should call onScroll when retry button is clicked', () => {
    spyOn(component, 'onScroll');
    const button = fixture.debugElement.nativeElement.querySelector('.retry-button');
    button.click();
    expect(component.onScroll).toHaveBeenCalled();
  });
});
