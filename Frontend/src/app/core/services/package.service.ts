import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Package,
  CreatePackage,
  UpdatePackage
} from '../models/package.model';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/product/packages/`;

  getAll(): Observable<Package[]> {
    return this.http.get<Package[]>(this.apiUrl);
  }

  getAvailable(): Observable<Package[]> {
    return this.http.get<Package[]>(`${this.apiUrl}available/`);
  }

  getById(id: number): Observable<Package> {
    return this.http.get<Package>(`${this.apiUrl}${id}/`);
  }

  create(data: CreatePackage): Observable<Package> {
    return this.http.post<Package>(this.apiUrl, data);
  }

  update(id: number, data: UpdatePackage): Observable<Package> {
    return this.http.patch<Package>(`${this.apiUrl}${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}