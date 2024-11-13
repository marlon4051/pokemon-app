import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxsModule } from '@ngxs/store';
import { PokemonState } from './store/pokemon.state';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { PokedexModule } from './features/pokedex/pokedex.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PokedexModule,
    NgxsModule.forRoot([PokemonState]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
