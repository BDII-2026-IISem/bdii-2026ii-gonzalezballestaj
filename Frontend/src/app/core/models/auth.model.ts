import type { HttpMethod, Status } from './api.model';

/** Cuerpo de POST /api/auth/login/: se envía username o email, nunca ambos vacíos. */
export interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
}

/** Respuesta de login y refresh: solo el par de tokens, sin datos del usuario. */
export interface TokenPair {
  access: string;
  refresh: string;
  tokenType: 'Bearer';
  accessExpiresIn: number;
}

/** Respuesta de GET /api/auth/profile/ (objeto directo, sin envoltorio). */
export interface SessionUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  status: Status;
  isSuperuser: boolean;
  isStaff: boolean;
  clientId: number | null;
}

/** Una entrada de GET /api/auth/permissions/: método, ruta y rol que la concede. */
export interface EffectivePermission {
  method: HttpMethod;
  path: string;
  roleId: number;
  roleName: string;
}

/** GET /api/auth/permissions/ responde envuelto en { permissions: [...] }. */
export interface PermissionsResponse {
  permissions: EffectivePermission[];
}

/** Cuerpo de POST /api/auth/register/: cuenta de usuario + ficha de cliente. */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  documentType: string;
  documentNumber: string;
  name: string;
  phone: string | null;
}
