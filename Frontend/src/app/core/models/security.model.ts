import type { HttpMethod, Status, Timestamps } from './api.model';

/** Tabla users — /api/users/. La respuesta NUNCA trae password. */
export interface User extends Timestamps {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  status: Status;
}

/** password es de solo escritura y viaja únicamente en el alta. */
export interface UserPayload {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  status: Status;
  password?: string;
}

/** Tabla roles — /api/roles/. name es único. */
export interface Role extends Timestamps {
  id: number;
  name: string;
  description: string | null;
  status: Status;
}

export interface RolePayload {
  name: string;
  description: string | null;
  status: Status;
}

/** Tabla resources — /api/resources/. route usa el formato de Django; (method, route) es único. */
export interface Resource extends Timestamps {
  id: number;
  name: string;
  method: HttpMethod;
  route: string;
  status: Status;
}

export interface ResourcePayload {
  name: string;
  method: HttpMethod;
  route: string;
  status: Status;
}

/** Tabla role_users — /api/role-users/. A quién se le da un rol. */
export interface RoleUser extends Timestamps {
  id: number;
  user: number;
  role: number;
  status: Status;
}

export interface RoleUserPayload {
  user: number;
  role: number;
  status: Status;
}

/** Tabla resource_roles — /api/resource-roles/. ESTA fila es el permiso. */
export interface ResourceRole extends Timestamps {
  id: number;
  resource: number;
  role: number;
  status: Status;
}

export interface ResourceRolePayload {
  resource: number;
  role: number;
  status: Status;
}
