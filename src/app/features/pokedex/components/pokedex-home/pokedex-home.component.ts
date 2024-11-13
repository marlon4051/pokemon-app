import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokedex-home',
  templateUrl: './pokedex-home.component.html',
  styleUrl: './pokedex-home.component.scss',
})
// component not used
export class PokedexHomeComponent {
  isOpen = false;

  constructor(private _router: Router) {}
  openPokedex() {
    this.isOpen = true;
    setTimeout(() => {
      this._router.navigate(['listPokemon']);
    }, 1000);
  }
}
