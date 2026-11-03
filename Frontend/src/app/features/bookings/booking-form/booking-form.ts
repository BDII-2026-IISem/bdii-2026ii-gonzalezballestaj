import { Component, input, output } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

import { Client } from '../../../core/models/client.model';
import { Departure } from '../../../core/models/departure.model';
import { CreateBooking } from '../../../core/models/booking.model';
import { CreateBookingPayment } from '../../../core/models/payment.model';

export interface BookingPayload extends CreateBooking {
  payments: CreateBookingPayment[];
}

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule
  ],
  templateUrl: './booking-form.html',
  styleUrl: './booking-form.css'
})
export class BookingForm {

  readonly clients = input<Client[]>([]);
  readonly departures = input<Departure[]>([]);
  readonly saving = input(false);

  readonly saved = output<BookingPayload>();
  readonly cancelled = output<void>();

  private readonly fb = new FormBuilder();

  readonly form = this.fb.group({
    client: [
      null as number | null,
      Validators.required
    ],

    departure: [
      null as number | null,
      Validators.required
    ],

    traveler: [
      null as number | null,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    startDate: [
      '',
      Validators.required
    ],

    endDate: [
      '',
      Validators.required
    ],

    observations: [''],

    referenceType: [
      'Reserva turística',
      Validators.required
    ],

    method: [
      '',
      [
        Validators.required,
        Validators.maxLength(50)
      ]
    ],

    amount: [
      null as number | null,
      [
        Validators.required,
        Validators.min(0.01)
      ]
    ],

    paymentDate: [
      new Date().toISOString().slice(0, 16),
      Validators.required
    ]

  }, {
    validators: (group) => {
      const start = group.get('startDate')?.value;
      const end = group.get('endDate')?.value;

      return start && end && end < start
        ? { dateOrder: true }
        : null;
    }
  });

  submit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const payload: BookingPayload = {
      client: value.client!,
      departure: value.departure!,
      traveler: value.traveler!,
      startDate: value.startDate!,
      endDate: value.endDate!,
      observations: value.observations?.trim() || null,

      payments: [
        {
          referenceType: value.referenceType!.trim(),
          method: value.method!.trim(),
          amount: value.amount!,
          paymentDate: value.paymentDate!
        }
      ]
    };

    this.saved.emit(payload);
  }

  cancel(): void {
    this.cancelled.emit();
  }
}