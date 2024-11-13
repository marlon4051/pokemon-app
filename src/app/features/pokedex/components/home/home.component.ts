import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  isOpen = false;
  openPokedex() {
    this.isOpen = true;
    setTimeout(() => {
      // Navegar a otra página después de la animación
      window.location.href = '/new-page'; // Cambia '/new-page' por la ruta de tu página
    }, 1000); // Ajusta el tiempo según la duración de tu animación
  }
}
