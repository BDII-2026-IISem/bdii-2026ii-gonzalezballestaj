import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { NAV } from '../../layout/shell/nav.config';
import { SessionStore } from '../services/session-store';

/** La raíz lleva a la primera entrada del menú que la sesión puede abrir. */
export const homeGuard: CanActivateFn = () => {
  const session = inject(SessionStore);
  const router = inject(Router);

  const first = NAV.flatMap((group) => group.items).find(
    (item) => item.permission && session.canPermission(item.permission)
  );

  return router.createUrlTree([first?.routerLink ?? '/perfil']);
};
