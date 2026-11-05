import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

/** Convierte un acceso denegado en una pista: qué permiso falta. */
@Component({
  selector: 'app-forbidden',
  standalone: true,
  host: { class: 'block' },
  imports: [ButtonModule, CardModule, RouterLink],
  templateUrl: './forbidden.html',
  styleUrl: './forbidden.css',
})
export class Forbidden {
  /** permissionGuard lo deja en la URL; llega ya decodificado. */
  readonly permission = inject(ActivatedRoute).snapshot.queryParamMap.get('permission');
}
