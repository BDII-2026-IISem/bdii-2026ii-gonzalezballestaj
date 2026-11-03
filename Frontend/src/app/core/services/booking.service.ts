import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Booking,
  CreateBooking,
  UpdateBooking
} from '../models/booking.model';
import { CreateBookingPayment } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/sale/bookings/`;

  getAll(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  getById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}${id}/`);
  }

  create(data: CreateBooking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, data);
  }

  register(
    data: CreateBooking & { payments: CreateBookingPayment[] }
  ): Observable<Booking> {
    return this.http.post<Booking>(
      `${this.apiUrl}register/`,
      data
    );
  }

  update(id: number, data: UpdateBooking): Observable<Booking> {
    return this.http.patch<Booking>(`${this.apiUrl}${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}