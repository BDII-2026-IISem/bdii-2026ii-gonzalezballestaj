import { TestBed } from '@angular/core/testing';

import { SessionStore } from './session-store';
import {
  EffectivePermission,
  SessionUser,
  TokenPair,
} from '../models/auth.model';

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

describe('SessionStore', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('resuelve :id, tolera la barra final y restaura la sesión', () => {
    const store = TestBed.inject(SessionStore);

    store.setTokens(PAR);
    store.setUser(USER, [
      PERMISO,
      { ...PERMISO, method: 'PATCH', path: '/api/clients/:id/' },
    ]);

    expect(store.isAuthenticated()).toBe(true);
    expect(store.permissionCount()).toBe(2);
    expect(store.roles()).toEqual(['admin']);

    expect(store.canPermission('GET /api/clients')).toBe(true);
    expect(store.canPermission('PATCH /api/clients/7')).toBe(true);
    expect(store.canPermission('PATCH /api/clients/7/')).toBe(true);
    expect(store.canPermission('DELETE /api/clients/7')).toBe(false);
    expect(store.canPermission('sin-espacio')).toBe(false);

    // Una instancia nueva restaura la sesión desde localStorage (como tras F5).
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const restored = TestBed.inject(SessionStore);

    expect(restored.accessToken()).toBe('a1');
    expect(restored.user()?.username).toBe('gonzalez');
    expect(restored.canPermission('GET /api/clients/')).toBe(true);
  });

  it('clear borra la sesión y el almacenamiento', () => {
    const store = TestBed.inject(SessionStore);
    store.setTokens(PAR);

    store.clear();

    expect(store.isAuthenticated()).toBe(false);
    expect(store.refreshToken()).toBeNull();
    expect(localStorage.getItem('wayuutravel.session.v1')).toBeNull();
  });
});
