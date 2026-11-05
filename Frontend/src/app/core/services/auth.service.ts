import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Observable,
  catchError,
  finalize,
  forkJoin,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  PermissionsResponse,
  RegisterRequest,
  SessionUser,
  TokenPair,
} from '../models/auth.model';
import { SessionStore } from './session-store';

/** Único punto de contacto con /api/auth/. El login solo devuelve el par de tokens. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(SessionStore);
  private readonly base = `${environment.apiUrl}/auth`;

  /** Login + perfil + permisos: no emite hasta que la sesión está completa. */
  login(credentials: LoginRequest): Observable<SessionUser> {
    return this.http.post<TokenPair>(`${this.base}/login/`, credentials).pipe(
      tap((tokens) => this.session.setTokens(tokens)),
      switchMap(() => this.loadSession())
    );
  }

  /** Registro de cliente: igual que el login, no emite hasta tener perfil y permisos. */
  register(data: RegisterRequest): Observable<SessionUser> {
    return this.http.post<TokenPair>(`${this.base}/register/`, data).pipe(
      tap((tokens) => this.session.setTokens(tokens)),
      switchMap(() => this.loadSession())
    );
  }

  /** GET /auth/profile/ (objeto directo) y GET /auth/permissions/ (envuelto), en paralelo. */
  me(): Observable<SessionUser> {
    return forkJoin({
      user: this.http.get<SessionUser>(`${this.base}/profile/`),
      permissions: this.http.get<PermissionsResponse>(`${this.base}/permissions/`),
    }).pipe(
      tap(({ user, permissions }) =>
        this.session.setUser(user, permissions.permissions)
      ),
      map(({ user }) => user)
    );
  }

  /** Renueva el par. El backend rota el refresh: el anterior deja de servir. */
  refresh(): Observable<TokenPair> {
    const refresh = this.session.refreshToken();

    if (!refresh) {
      return throwError(() => new Error('La sesión no tiene refresh token.'));
    }

    return this.http
      .post<TokenPair>(`${this.base}/refresh/`, { refresh })
      .pipe(tap((tokens) => this.session.setTokens(tokens)));
  }

  /** Invalida el refresh en el servidor y borra la sesión local aunque falle la red. */
  logout(): Observable<unknown> {
    const refresh = this.session.refreshToken();

    const request: Observable<unknown> = refresh
      ? this.http.post(`${this.base}/logout/`, { refresh })
      : of(null);

    return request.pipe(
      catchError(() => of(null)),
      finalize(() => this.session.clear())
    );
  }

  /** Tras recibir el par: pide perfil y permisos; si fallan, no deja una sesión a medias. */
  private loadSession(): Observable<SessionUser> {
    return this.me().pipe(
      catchError((error: unknown) => {
        this.session.clear();
        return throwError(() => error);
      })
    );
  }
}