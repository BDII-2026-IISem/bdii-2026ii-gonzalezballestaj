import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Departure,
  CreateDeparture,
  UpdateDeparture
} from '../models/departure.model';

@Injectable({
  providedIn: 'root'
})
export class DepartureService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/product/departures/`;

  getAll(): Observable<Departure[]> {
    return this.http.get<Departure[]>(this.apiUrl);
  }

  getById(id: number): Observable<Departure> {
    return this.http.get<Departure>(`${this.apiUrl}${id}/`);
  }

  create(data: CreateDeparture): Observable<Departure> {
    return this.http.post<Departure>(this.apiUrl, data);
  }

  update(id: number, data: UpdateDeparture): Observable<Departure> {
    return this.http.patch<Departure>(`${this.apiUrl}${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}