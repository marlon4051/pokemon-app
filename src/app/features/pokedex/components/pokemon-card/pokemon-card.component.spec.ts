import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonCardComponent } from './pokemon-card.component';
import { By } from '@angular/platform-browser';
import { Pokemon } from '../../../../models/pokemon.model';

describe('PokemonCardComponent', () => {
  let component: PokemonCardComponent;
  let fixture: ComponentFixture<PokemonCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PokemonCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonCardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the pokemon image when not flipped', () => {
    const pokemon: Pokemon = {
      name: 'Pikachu',
      imageUrl: 'pikachu-image-url',
      height: 0.4,
      weight: 6,
    };
    component.pokemon = pokemon;
    fixture.detectChanges();

    const imgElement = fixture.debugElement.query(By.css('.pokemon-image'));
    expect(imgElement).toBeTruthy();
    expect(imgElement.nativeElement.src).toContain(pokemon.imageUrl);
  });

  it('should toggle flipped state on pokeball click', () => {
    const pokemon: Pokemon = {
      name: 'Pikachu',
      imageUrl: 'pikachu-image-url',
      height: 0.4,
      weight: 6,
    };
    component.pokemon = pokemon;
    fixture.detectChanges();

    const pokeball = fixture.debugElement.query(By.css('.pokeball'));
    expect(component.flipped).toBeFalse();

    // Simulate a click to toggle
    pokeball.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.flipped).toBeTrue();
  });

  it('should display the pokemon details when flipped', () => {
    const pokemon: Pokemon = {
      name: 'Pikachu',
      imageUrl: 'pikachu-image-url',
      height: 0.4,
      weight: 6,
    };
    component.pokemon = pokemon;
    fixture.detectChanges();

    let pokemonDetails = fixture.debugElement.query(By.css('.pokemon-details'));
    expect(pokemonDetails).toBeFalsy(); 

    component.togglePokeball();
    fixture.detectChanges();

    // After flipping, the details should be visible
    pokemonDetails = fixture.debugElement.query(By.css('.pokemon-details'));
    expect(pokemonDetails).toBeTruthy();
    expect(pokemonDetails.nativeElement.textContent).toContain(pokemon.name);
    expect(pokemonDetails.nativeElement.textContent).toContain(
      pokemon.height.toString()
    );
    expect(pokemonDetails.nativeElement.textContent).toContain(
      pokemon.weight.toString()
    );
  });
});
