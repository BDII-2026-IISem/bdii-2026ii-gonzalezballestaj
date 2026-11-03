import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  IncludedService,
  CreateIncludedService,
  UpdateIncludedService
} from '../models/included-service.model';

@Injectable({
  providedIn: 'root'
})
export class IncludedServiceService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/product/included-services/`;

  getAll(): Observable<IncludedService[]> {
    return this.http.get<IncludedService[]>(this.apiUrl);
  }

  getById(id: number): Observable<IncludedService> {
    return this.http.get<IncludedService>(`${this.apiUrl}${id}/`);
  }

  create(data: CreateIncludedService): Observable<IncludedService> {
    return this.http.post<IncludedService>(this.apiUrl, data);
  }

  update(id: number, data: UpdateIncludedService): Observable<IncludedService> {
    return this.http.patch<IncludedService>(`${this.apiUrl}${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}