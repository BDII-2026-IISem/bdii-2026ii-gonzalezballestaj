import type { HttpMethod } from '../models/api.model';

/** Opciones del selector de método: el valor es el propio verbo. */
export const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const SEVERITY: Record<HttpMethod, 'info' | 'success' | 'warn' | 'danger'> = {
  GET: 'info',
  POST: 'success',
  PUT: 'warn',
  PATCH: 'warn',
  DELETE: 'danger',
};

/** Lectura informativa, creación en verde, edición en aviso y borrado en peligro. */
export function methodSeverity(method?: string): 'info' | 'success' | 'warn' | 'danger' | 'secondary' {
  return method && method in SEVERITY ? SEVERITY[method as HttpMethod] : 'secondary';
}

/**
 * Misma traducción que el backend (to_client_path):
 * 'api/product/packages/(?P<pk>[^/.]+)/$' → '/api/product/packages/:id/'
 */
export function toClientPath(route: string): string {
  const path = route
    .replace(/\(\?P<[^>]+>[^)]*\)/g, ':id')
    .replace(/<[^>]+>/g, ':id')
    .replace(/[\^$]/g, '');
  return '/' + path.replace(/^\/+/, '');
}
