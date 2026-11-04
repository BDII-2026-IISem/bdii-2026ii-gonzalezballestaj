import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { BookingService } from '../../../core/services/booking.service';
import { PaymentService } from '../../../core/services/payment.service';

import { Booking } from '../../../core/models/booking.model';
import { Payment } from '../../../core/models/payment.model';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './booking-detail.html',
  styleUrl: './booking-detail.css'
})
export class BookingDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly bookingService = inject(BookingService);
  private readonly paymentService = inject(PaymentService);

  booking = signal<Booking | null>(null);
  payments = signal<Payment[]>([]);
  loading = signal(true);
  cancelling = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  private bookingId = 0;

  ngOnInit(): void {
    this.bookingId = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(this.bookingId) || this.bookingId <= 0) {
      this.error.set('El identificador de la reserva no es válido.');
      this.loading.set(false);
      return;
    }

    this.loadBooking();
  }

  private loadBooking(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      booking: this.bookingService.getById(this.bookingId),
      payments: this.paymentService.getAll()
    }).subscribe({
      next: (result) => {
        this.booking.set(result.booking);
        this.payments.set(
          result.payments.filter(
            payment => payment.booking === this.bookingId
          )
        );
        this.loading.set(false);
      },
      error: () => {
        this.error.set(
          'No fue posible cargar la reserva y sus pagos.'
        );
        this.loading.set(false);
      }
    });
  }

  cancelBooking(): void {
    const reservation = this.booking();

    if (!reservation || reservation.status !== 'active') {
      return;
    }

    const confirmed = window.confirm(
      `¿Estás seguro de cancelar la reserva #${reservation.id}? Esta operación devolverá el cupo disponible.`
    );

    if (!confirmed) {
      return;
    }

    this.cancelling.set(true);
    this.error.set(null);
    this.success.set(null);

    this.bookingService.cancel(reservation.id, {
      name: `Cancelación de reserva #${reservation.id}`,
      descriptions: 'Cancelación realizada desde el sistema Wayuu Travel.'
    }).subscribe({
      next: () => {
        this.bookingService.getById(reservation.id).subscribe({
          next: (updatedBooking) => {
            this.booking.set(updatedBooking);
            this.success.set('La reserva fue cancelada correctamente y el cupo fue devuelto.');
            this.cancelling.set(false);
          },
          error: () => {
            this.success.set('La cancelación fue registrada correctamente.');
            this.booking.update(current =>
              current ? { ...current, status: 'inactive' } : null
            );
            this.cancelling.set(false);
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        const detail = err.error?.booking_id?.[0]
          ?? err.error?.detail
          ?? 'No fue posible cancelar la reserva.';

        this.error.set(detail);
        this.cancelling.set(false);
      }
    });
  }
}