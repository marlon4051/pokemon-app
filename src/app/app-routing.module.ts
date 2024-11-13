import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PokemonListComponent } from './features/pokedex/components/pokemon-list/pokemon-list.component';
import { PokedexHomeComponent } from './features/pokedex/components/pokedex-home/pokedex-home.component';

const routes: Routes = [
  { path: '', redirectTo: '/listPokemon', pathMatch: 'full' },//{ path: '', redirectTo: '/pokedex', pathMatch: 'full' },
  { path: 'pokedexHome', component: PokedexHomeComponent },
  { path: 'listPokemon', component: PokemonListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
