import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  Booking,
  CreateBooking,
  UpdateBooking
} from '../models/booking.model';

import { CreateBookingPayment } from '../models/payment.model';

/**
 * El backend responde en camelCase; se aceptan también las claves
 * en snake_case por si alguna ruta las devuelve así.
 */
interface BookingApi {
  id: number;
  client: number;
  departure: number;
  traveler: number;
  observations: string | null;
  status: 'active' | 'inactive';
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CancelBooking {
  name: string;
  descriptions?: string | null;
}

export interface CancellationApi {
  id: number;
  booking: number;
  name: string;
  descriptions: string | null;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/sale/bookings/`;

  private toModel(data: BookingApi): Booking {
    return {
      id: data.id,
      client: data.client,
      departure: data.departure,
      traveler: data.traveler,
      startDate: data.startDate ?? data.start_date ?? '',
      endDate: data.endDate ?? data.end_date ?? '',
      observations: data.observations,
      status: data.status,
      createdAt: data.createdAt ?? data.created_at ?? '',
      updatedAt: data.updatedAt ?? data.updated_at ?? ''
    };
  }

  private toApi(data: Partial<CreateBooking>) {
    return {
      ...(data.client !== undefined && { client: data.client }),
      ...(data.departure !== undefined && { departure: data.departure }),
      ...(data.traveler !== undefined && { traveler: data.traveler }),
      ...(data.startDate !== undefined && {
        start_date: data.startDate
      }),
      ...(data.endDate !== undefined && {
        end_date: data.endDate
      }),
      ...(data.observations !== undefined && {
        observations: data.observations
      })
    };
  }

  getAll(): Observable<Booking[]> {
    return this.http.get<BookingApi[]>(this.apiUrl).pipe(
      map((rows) => rows.map((row) => this.toModel(row)))
    );
  }

  getById(id: number): Observable<Booking> {
    return this.http.get<BookingApi>(`${this.apiUrl}${id}/`).pipe(
      map((data) => this.toModel(data))
    );
  }

  create(data: CreateBooking): Observable<Booking> {
    return this.http.post<BookingApi>(
      this.apiUrl,
      this.toApi(data)
    ).pipe(
      map((response) => this.toModel(response))
    );
  }

  register(
    data: CreateBooking & { payments: CreateBookingPayment[] }
  ): Observable<Booking> {
    const payload = {
      ...this.toApi(data),
      payments: data.payments.map((payment) => ({
        reference_type: payment.referenceType,
        method: payment.method,
        amount: payment.amount,
        payment_date: payment.paymentDate
      }))
    };

    return this.http.post<BookingApi>(
      `${this.apiUrl}register/`,
      payload
    ).pipe(
      map((response) => this.toModel(response))
    );
  }

  update(id: number, data: UpdateBooking): Observable<Booking> {
    return this.http.patch<BookingApi>(
      `${this.apiUrl}${id}/`,
      this.toApi(data)
    ).pipe(
      map((response) => this.toModel(response))
    );
  }

  cancel(
    id: number,
    data: CancelBooking
  ): Observable<CancellationApi> {
    return this.http.post<CancellationApi>(
      `${this.apiUrl}${id}/cancel/`,
      data
    );
  }
}