import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';

import { authInterceptor } from './auth-interceptor';
import { ClientService } from '../services/client.service';
import { SessionStore } from '../services/session-store';
import { TokenPair } from '../models/auth.model';

const API = 'http://localhost:8000/api';

const PAR: TokenPair = {
  access: 'a1',
  refresh: 'r1',
  tokenType: 'Bearer',
  accessExpiresIn: 3600,
};

const UNAUTHORIZED = { status: 401, statusText: 'Unauthorized' };

describe('authInterceptor', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideRouter([{ path: 'login', children: [] }]),
        MessageService,
      ],
    });
  });

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('adjunta Bearer y refresca una sola vez ante dos 401 simultáneos', () => {
    const store = TestBed.inject(SessionStore);
    store.setTokens({ ...PAR, access: 'viejo' });

    const clients = TestBed.inject(ClientService);
    const http = TestBed.inject(HttpTestingController);

    clients.list().subscribe();
    clients.list().subscribe();

    const original = http.match(`${API}/clients/`);
    expect(original.length).toBe(2);
    expect(original[0].request.headers.get('Authorization')).toBe('Bearer viejo');

    original[0].flush({ detail: 'vencido' }, UNAUTHORIZED);
    original[1].flush({ detail: 'vencido' }, UNAUTHORIZED);

    // Single-flight: una sola llamada al refresh para las dos peticiones.
    const refresh = http.expectOne(`${API}/auth/refresh/`);
    expect(refresh.request.headers.has('Authorization')).toBe(false);
    expect(refresh.request.body).toEqual({ refresh: 'r1' });
    refresh.flush({ ...PAR, access: 'nuevo', refresh: 'r2' });

    const retried = http.match(`${API}/clients/`);
    expect(retried.length).toBe(2);
    retried.forEach((request) => {
      expect(request.request.headers.get('Authorization')).toBe('Bearer nuevo');
      request.flush([]);
    });

    expect(store.refreshToken()).toBe('r2');
  });

  it('si el refresh falla, limpia la sesión', () => {
    const store = TestBed.inject(SessionStore);
    store.setTokens({ ...PAR, access: 'viejo' });

    const http = TestBed.inject(HttpTestingController);
    let failed = false;

    TestBed.inject(ClientService).list().subscribe({ error: () => (failed = true) });

    http.expectOne(`${API}/clients/`).flush({ detail: 'vencido' }, UNAUTHORIZED);
    http
      .expectOne(`${API}/auth/refresh/`)
      .flush({ detail: 'Refresh token inválido o no vigente.' }, UNAUTHORIZED);

    expect(failed).toBe(true);
    expect(store.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('wayuutravel.session.v1')).toBeNull();
  });
});
