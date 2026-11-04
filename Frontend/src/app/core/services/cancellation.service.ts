import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Cancellation } from '../models/cancellation.model';

/**
 * Solo lectura: las cancelaciones se registran únicamente con
 * BookingService.cancel(), que devuelve el cupo a la salida.
 */
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
}
