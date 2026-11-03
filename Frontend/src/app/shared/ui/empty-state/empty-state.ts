import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
})
export class EmptyState {
  readonly title = input('No hay información disponible');
  readonly description = input(
    'Todavía no existen registros para mostrar.'
  );
  readonly icon = input('pi pi-inbox');
}