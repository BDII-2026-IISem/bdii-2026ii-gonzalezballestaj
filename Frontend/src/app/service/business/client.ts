
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Observable,
  BehaviorSubject,
  tap,
  catchError,
  throwError
} from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ClientI,
  ClientResponseI
} from '../../models/business/client';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({
  providedIn: 'root',
})
export class Client {
  private baseUrl = 'http://127.0.0.1:8000/api/clients/';

  private clientsSubject =
    new BehaviorSubject<ClientResponseI[]>([]);

  public clients$ = this.clientsSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token =
      localStorage.getItem('access') ??
      localStorage.getItem('access_token') ??
      sessionStorage.getItem('access') ??
      sessionStorage.getItem('access_token');

    if (!token) {
      console.error(
        'No se encontró el token de acceso. Verifica el inicio de sesión.'
      );
      return new HttpHeaders();
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  private normalizeClientsResponse(
    response: PaginatedResponse<ClientResponseI> | ClientResponseI[]
  ): ClientResponseI[] {
    if (Array.isArray(response)) {
      return response;
    }

    return response.results ?? [];
  }

  getAllClients(): Observable<ClientResponseI[]> {
    return this.http
      .get<
        PaginatedResponse<ClientResponseI> | ClientResponseI[]
      >(this.baseUrl, {
        headers: this.getAuthHeaders()
      })
      .pipe(
        map(response => this.normalizeClientsResponse(response)),
        tap(clients => {
          console.log('Fetched clients:', clients);
          this.clientsSubject.next(clients);
        }),
        catchError(error => {
          console.error('Error fetching clients:', error);
          return throwError(() => error);
        })
      );
  }

  getClientById(id: number): Observable<ClientResponseI> {
    return this.http
      .get<ClientResponseI>(`${this.baseUrl}${id}/`, {
        headers: this.getAuthHeaders()
      })
      .pipe(
        catchError(error => {
          console.error('Error fetching client:', error);
          return throwError(() => error);
        })
      );
  }

  createClient(client: ClientI): Observable<ClientResponseI> {
    return this.http
      .post<ClientResponseI>(this.baseUrl, client, {
        headers: this.getAuthHeaders()
      })
      .pipe(
        tap(() => this.refreshClients()),
        catchError(error => {
          console.error('Error creating client:', error);
          return throwError(() => error);
        })
      );
  }

  updateClient(
    id: number,
    client: Partial<ClientI>
  ): Observable<ClientResponseI> {
    return this.http
      .put<ClientResponseI>(`${this.baseUrl}${id}/`, client, {
        headers: this.getAuthHeaders()
      })
      .pipe(
        tap(response => {
          console.log('Client updated:', response);
          this.refreshClients();
        }),
        catchError(error => {
          console.error('Error updating client:', error);
          return throwError(() => error);
        })
      );
  }

  partialUpdateClient(
    id: number,
    client: Partial<ClientI>
  ): Observable<ClientResponseI> {
    return this.http
      .patch<ClientResponseI>(`${this.baseUrl}${id}/`, client, {
        headers: this.getAuthHeaders()
      })
      .pipe(
        tap(() => this.refreshClients()),
        catchError(error => {
          console.error('Error partially updating client:', error);
          return throwError(() => error);
        })
      );
  }

  deleteClient(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}${id}/`, {
        headers: this.getAuthHeaders()
      })
      .pipe(
        tap(() => {
          console.log('Client deleted:', id);
          this.refreshClients();
        }),
        catchError(error => {
          console.error('Error deleting client:', error);
          return throwError(() => error);
        })
      );
  }

  updateLocalClients(clients: ClientResponseI[]): void {
    this.clientsSubject.next(clients);
  }

  refreshClients(): void {
    this.getAllClients().subscribe({
      next: clients => this.clientsSubject.next(clients),
      error: error => {
        console.error('Error refreshing clients:', error);
      }
    });
  }
}
