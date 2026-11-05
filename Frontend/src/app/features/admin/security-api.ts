import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { EffectivePermission } from '../../core/models/auth.model';
import {
  Resource,
  ResourcePayload,
  ResourceRole,
  ResourceRolePayload,
  Role,
  RolePayload,
  RoleUser,
  RoleUserPayload,
  User,
  UserPayload,
} from '../../core/models/security.model';

/** CRUD común de las cinco tablas de seguridad. endpoint va SIN barra final. */
export abstract class CrudService<T, P> {
  protected readonly http = inject(HttpClient);

  protected constructor(protected readonly endpoint: string) {}

  /** ?status=all incluye las filas inactivas, para poder reactivarlas. */
  list(): Observable<T[]> {
    return this.http.get<T[]>(`${this.endpoint}/`, { params: { status: 'all' } });
  }

  create(payload: P): Observable<T> {
    return this.http.post<T>(`${this.endpoint}/`, payload);
  }

  update(id: number, payload: Partial<P>): Observable<T> {
    return this.http.patch<T>(`${this.endpoint}/${id}/`, payload);
  }

  /** DELETE es baja lógica: 204 y la fila queda inactive. */
  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}/`);
  }
}

@Injectable({ providedIn: 'root' })
export class UserApi extends CrudService<User, UserPayload> {
  constructor() {
    super(`${environment.apiUrl}/users`);
  }

  /** GET /api/users/{id}/permissions/: el cuerpo llega envuelto en permissions. */
  permissions(id: number): Observable<EffectivePermission[]> {
    return this.http
      .get<{ permissions: EffectivePermission[] }>(`${this.endpoint}/${id}/permissions/`)
      .pipe(map((response) => response.permissions));
  }
}

@Injectable({ providedIn: 'root' })
export class RoleApi extends CrudService<Role, RolePayload> {
  constructor() {
    super(`${environment.apiUrl}/roles`);
  }
}

@Injectable({ providedIn: 'root' })
export class ResourceApi extends CrudService<Resource, ResourcePayload> {
  constructor() {
    super(`${environment.apiUrl}/resources`);
  }
}

@Injectable({ providedIn: 'root' })
export class RoleUserApi extends CrudService<RoleUser, RoleUserPayload> {
  constructor() {
    super(`${environment.apiUrl}/role-users`);
  }
}

@Injectable({ providedIn: 'root' })
export class ResourceRoleApi extends CrudService<ResourceRole, ResourceRolePayload> {
  constructor() {
    super(`${environment.apiUrl}/resource-roles`);
  }
}
