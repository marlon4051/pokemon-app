import { Component, Input } from '@angular/core';
import { Pokemon } from '../../../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.scss',
})
export class PokemonCardComponent {
  @Input() pokemon: Pokemon | undefined; 
  public flipped = false;

  public togglePokeball() {
    this.flipped = !this.flipped;
  }
}
