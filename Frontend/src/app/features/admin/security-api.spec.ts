import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { ResourceRoleApi, UserApi } from './security-api';
import { User } from '../../core/models/security.model';

const API = 'http://localhost:8000/api';

const USUARIO: User = {
  id: 3,
  username: 'Rafael',
  email: 'rafael@gmail.com',
  firstName: '',
  lastName: '',
  status: 'active',
  createdAt: '2026-10-12T00:00:00-05:00',
  updatedAt: '2026-10-12T00:00:00-05:00',
};

describe('API de seguridad', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lista usuarios con ?status=all y sin campo password', () => {
    let rows: User[] = [];
    TestBed.inject(UserApi).list().subscribe((response) => (rows = response));

    const req = http.expectOne((r) => r.url === `${API}/users/`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('status')).toBe('all');
    req.flush([USUARIO]);

    expect(Object.keys(rows[0])).not.toContain('password');
  });

  it('no envía password al editar un usuario', () => {
    TestBed.inject(UserApi)
      .update(3, {
        username: 'Rafael',
        email: 'rafael@gmail.com',
        firstName: 'Rafael',
        lastName: '',
        status: 'active',
      })
      .subscribe();

    const patch = http.expectOne(`${API}/users/3/`);
    expect(patch.request.method).toBe('PATCH');
    expect('password' in (patch.request.body as object)).toBe(false);
    patch.flush(USUARIO);
  });

  it('desenvuelve los permisos efectivos de un usuario', () => {
    let count = 0;
    TestBed.inject(UserApi).permissions(3).subscribe((rows) => (count = rows.length));

    http.expectOne(`${API}/users/3/permissions/`).flush({
      permissions: [
        { method: 'GET', path: '/api/clients/', roleId: 3, roleName: 'vendedor' },
        { method: 'GET', path: '/api/clients/:id/', roleId: 3, roleName: 'vendedor' },
      ],
    });

    expect(count).toBe(2);
  });

  it('concede un permiso enviando role y resource numéricos', () => {
    TestBed.inject(ResourceRoleApi).create({ role: 3, resource: 4, status: 'active' }).subscribe();

    const alta = http.expectOne(`${API}/resource-roles/`);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual({ role: 3, resource: 4, status: 'active' });
    alta.flush({ id: 200, role: 3, resource: 4, status: 'active' });
  });
});
