import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { SessionStore } from './session-store';
import {
  EffectivePermission,
  SessionUser,
  TokenPair,
} from '../models/auth.model';

const API = 'http://localhost:8000/api';

const PAR: TokenPair = {
  access: 'a1',
  refresh: 'r1',
  tokenType: 'Bearer',
  accessExpiresIn: 3600,
};

const USER: SessionUser = {
  id: 1,
  username: 'gonzalez',
  email: 'gonzalez@wayuutravel.test',
  firstName: 'Jaime',
  lastName: 'González',
  status: 'active',
  isSuperuser: false,
  isStaff: false,
};

const PERMISO: EffectivePermission = {
  method: 'GET',
  path: '/api/clients/',
  roleId: 1,
  roleName: 'admin',
};

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('guarda el par y solo emite después de recibir perfil y permisos', () => {
    const http = TestBed.inject(HttpTestingController);
    const session = TestBed.inject(SessionStore);
    let emitted: SessionUser | undefined;

    TestBed.inject(AuthService)
      .login({ username: 'gonzalez', password: 'secreta' })
      .subscribe((user) => (emitted = user));

    const login = http.expectOne(`${API}/auth/login/`);
    expect(login.request.body).toEqual({ username: 'gonzalez', password: 'secreta' });
    login.flush(PAR);

    // El par ya está guardado, pero login() todavía no emite.
    expect(session.accessToken()).toBe('a1');
    expect(emitted).toBeUndefined();

    http.expectOne(`${API}/auth/profile/`).flush(USER);
    http.expectOne(`${API}/auth/permissions/`).flush({ permissions: [PERMISO] });

    expect(emitted).toEqual(USER);
    expect(session.user()).toEqual(USER);
    expect(session.permissionCount()).toBe(1);
  });

  it('limpia la sesión si falla la carga del perfil', () => {
    const http = TestBed.inject(HttpTestingController);
    const session = TestBed.inject(SessionStore);
    let failed = false;

    TestBed.inject(AuthService)
      .login({ email: 'gonzalez@wayuutravel.test', password: 'secreta' })
      .subscribe({ error: () => (failed = true) });

    http.expectOne(`${API}/auth/login/`).flush(PAR);
    http.expectOne(`${API}/auth/permissions/`).flush({ permissions: [PERMISO] });
    http
      .expectOne(`${API}/auth/profile/`)
      .flush({ detail: 'Error' }, { status: 500, statusText: 'Server Error' });

    expect(failed).toBe(true);
    expect(session.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('wayuutravel.session.v1')).toBeNull();
  });
});
