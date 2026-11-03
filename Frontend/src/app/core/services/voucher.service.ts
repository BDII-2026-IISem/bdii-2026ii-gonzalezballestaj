import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Voucher,
  CreateVoucher,
  UpdateVoucher
} from '../models/voucher.model';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/sale/vouchers/`;

  getAll(): Observable<Voucher[]> {
    return this.http.get<Voucher[]>(this.apiUrl);
  }

  getById(id: number): Observable<Voucher> {
    return this.http.get<Voucher>(`${this.apiUrl}${id}/`);
  }

  create(data: CreateVoucher): Observable<Voucher> {
    return this.http.post<Voucher>(this.apiUrl, data);
  }

  update(id: number, data: UpdateVoucher): Observable<Voucher> {
    return this.http.patch<Voucher>(`${this.apiUrl}${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}