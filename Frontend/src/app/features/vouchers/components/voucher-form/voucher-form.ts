import {
  Component,
  computed,
  effect,
  input,
  output
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

import {
  Voucher,
  CreateVoucher
} from '../../../../core/models/voucher.model';

export interface BookingOption {
  id: number;
  label: string;
  active: boolean;
}

@Component({
  selector: 'app-voucher-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule
  ],
  templateUrl: './voucher-form.html',
  styleUrl: './voucher-form.css'
})
export class VoucherForm {
  readonly voucher = input<Voucher | null>(null);
  readonly bookingOptions = input<BookingOption[]>([]);
  readonly saving = input(false);
  readonly resetKey = input(0);

  readonly saved = output<CreateVoucher>();
  readonly cancelled = output<void>();

  private readonly fb = new FormBuilder();

  readonly form = this.fb.group({
    booking: [null as number | null, Validators.required],
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    descriptions: ['']
  });

  /** Reservas activas, más la reserva actual del comprobante si ya no lo está. */
  readonly selectableBookings = computed(() => {
    const currentBooking = this.voucher()?.booking;
    return this.bookingOptions().filter(
      (option) => option.active || option.id === currentBooking
    );
  });

  constructor() {
    effect(() => {
      const current = this.voucher();
      this.resetKey();

      if (current) {
        this.form.reset({
          booking: current.booking,
          name: current.name,
          descriptions: current.descriptions ?? ''
        });
        this.form.controls.booking.disable();
      } else {
        this.form.reset({
          booking: null,
          name: '',
          descriptions: ''
        });
        this.form.controls.booking.enable();
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const payload: CreateVoucher = {
      booking: Number(value.booking),
      name: value.name!.trim(),
      descriptions: value.descriptions?.trim() || null
    };

    this.saved.emit(payload);
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
