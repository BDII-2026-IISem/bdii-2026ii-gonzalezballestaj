import { Component, effect, inject, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

import { Departure } from '../../../core/models/departure.model';
import { BookingService } from '../../../core/services/booking.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SessionStore } from '../../../core/services/session-store';

/** Fecha ISO del backend → valor de <input type="date">, en hora local. */
function toDateInput(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** La fecha de fin no puede ser anterior a la de inicio. */
function dateOrder(group: AbstractControl): ValidationErrors | null {
  const start = group.get('startDate')?.value;
  const end = group.get('endDate')?.value;
  return start && end && end < start ? { dateOrder: true } : null;
}

@Component({
  selector: 'app-self-booking',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    MessageModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './self-booking.html',
  styleUrl: './self-booking.css',
})
export class SelfBooking {
  readonly departure = input.required<Departure>();
  readonly booked = output<number>();
  readonly cancelled = output<void>();

  private readonly bookingService = inject(BookingService);
  private readonly session = inject(SessionStore);
  private readonly notify = inject(NotificationService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly methods = ['Tarjeta', 'Transferencia', 'Nequi', 'Efectivo'];
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.group(
    {
      travelerName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      method: ['Tarjeta', [Validators.required]],
      amount: [0, [Validators.required, Validators.min(1)]],
      observations: [''],
    },
    { validators: dateOrder }
  );

  constructor() {
    // Al abrir el formulario: fechas desde la salida y viajero con el nombre del cliente.
    effect(() => {
      const start = toDateInput(this.departure().departureDate);
      const user = this.session.user();
      const name = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();

      this.form.reset({
        travelerName: name,
        startDate: start,
        endDate: start,
        method: 'Tarjeta',
        amount: 0,
        observations: '',
      });
      this.error.set(null);
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.saving.set(true);
    this.error.set(null);

    this.bookingService
      .registerSelf({
        departure: this.departure().id,
        startDate: value.startDate,
        endDate: value.endDate,
        travelerName: value.travelerName.trim(),
        observations: value.observations.trim() || null,
        payments: [
          {
            referenceType: 'Reserva turística',
            method: value.method,
            amount: Number(value.amount),
            paymentDate: new Date().toISOString(),
          },
        ],
      })
      .subscribe({
        next: (booking) => {
          this.saving.set(false);
          this.notify.success(`Tu reserva #${booking.id} quedó registrada.`, 'Reserva confirmada');
          this.booked.emit(booking.id);
        },
        error: (err: HttpErrorResponse) => {
          this.saving.set(false);
          this.error.set(this.firstMessage(err));
        },
      });
  }

  cancel(): void {
    this.cancelled.emit();
  }

  /** Primer mensaje de validación de Django, por ejemplo «No hay cupos disponibles.». */
  private firstMessage(err: HttpErrorResponse): string {
    const body = err.error;
    if (body && typeof body === 'object') {
      const first = Object.values(body)[0];
      const message = Array.isArray(first) ? first[0] : first;
      if (typeof message === 'string' && message) {
        return message;
      }
    }
    return 'No fue posible registrar la reserva.';
  }
}
