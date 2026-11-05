import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { NotificationService } from '../services/notification.service';

/** Rutas de sesión: su error se explica en el formulario, no en una notificación. */
const AUTH_ENTRY = ['/auth/login/', '/auth/register/', '/auth/refresh/', '/auth/logout/'];

/** Código HTTP → [mensaje, título], en el orden que recibe NotificationService. */
const MESSAGES: Record<number, [string, string]> = {
  0: ['Verifica que Django esté corriendo en http://localhost:8000.', 'Sin conexión con la API'],
  403: ['Tu rol no tiene el permiso que exige esta operación.', 'Acceso denegado'],
  404: ['El registro ya no existe.', 'Registro no encontrado'],
  409: ['Ese valor ya está registrado.', 'Dato duplicado'],
};

let lastToast = { key: '', at: 0 };

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotificationService);

  return next(req).pipe(
    catchError((error: unknown) => {
      // 400: lo muestra el formulario. 401: lo resuelve authInterceptor.
      const isAuthEntry = AUTH_ENTRY.some((endpoint) => req.url.includes(endpoint));

      if (error instanceof HttpErrorResponse && !isAuthEntry) {
        const message = MESSAGES[error.status];

        if (message) {
          toastOnce(`${error.status}-${req.url}`, () =>
            notify.error(message[0], message[1])
          );
        } else if (error.status >= 500) {
          toastOnce(`server-${error.status}`, () =>
            notify.error('Revisa la consola de Django.', 'Error del servidor')
          );
        }
      }

      return throwError(() => error);
    })
  );
};

/** Un mismo fallo repetido en ráfaga produce un solo aviso. */
function toastOnce(key: string, show: () => void): void {
  const now = Date.now();

  if (lastToast.key === key && now - lastToast.at < 4000) {
    return;
  }

  lastToast = { key, at: now };
  show();
}