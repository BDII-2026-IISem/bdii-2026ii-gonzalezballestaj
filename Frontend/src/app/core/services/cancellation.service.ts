import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Cancellation,
  CreateCancellation,
  UpdateCancellation
} from '../models/cancellation.model';

@Injectable({
  providedIn: 'root'
})
export class CancellationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/sale/cancellations/`;

  getAll(): Observable<Cancellation[]> {
    return this.http.get<Cancellation[]>(this.apiUrl);
  }

  getById(id: number): Observable<Cancellation> {
    return this.http.get<Cancellation>(`${this.apiUrl}${id}/`);
  }

  create(data: CreateCancellation): Observable<Cancellation> {
    return this.http.post<Cancellation>(this.apiUrl, data);
  }

  update(id: number, data: UpdateCancellation): Observable<Cancellation> {
    return this.http.patch<Cancellation>(`${this.apiUrl}${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}