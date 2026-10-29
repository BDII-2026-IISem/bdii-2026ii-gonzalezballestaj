
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginCredentials {
  username?: string;
  email?: string;
  password: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
  token_type: string;
  access_expires_in: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://127.0.0.1:8000/api/auth/';

  login(credentials: LoginCredentials): Observable<TokenResponse> {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');

  return this.http.post<TokenResponse>(
    `${this.apiUrl}login/`,
    credentials
  ).pipe(
    tap((tokens) => {
      localStorage.setItem('access', tokens.access);
      localStorage.setItem('refresh', tokens.refresh);
    })
  );
}

  getProfile(): Observable<Record<string, unknown>> {
    const token = localStorage.getItem('access');

    return this.http.get<Record<string, unknown>>(
      `${this.apiUrl}profile/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  logout(): void {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access');
  }
}
