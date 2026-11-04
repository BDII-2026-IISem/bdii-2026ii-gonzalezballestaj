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
  Departure,
  CreateDeparture
} from '../../../../core/models/departure.model';
import { Package } from '../../../../core/models/package.model';

/** Convierte la fecha ISO del backend al formato de <input type="datetime-local">. */
export function toDateTimeInput(iso: string | null | undefined): string {
  if (!iso) {
    return '';
  }

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const pad = (value: number) => String(value).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

@Component({
  selector: 'app-departure-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule
  ],
  templateUrl: './departure-form.html',
  styleUrl: './departure-form.css'
})
export class DepartureForm {
  readonly departure = input<Departure | null>(null);
  readonly packages = input<Package[]>([]);
  readonly saving = input(false);
  readonly resetKey = input(0);

  readonly saved = output<CreateDeparture>();
  readonly cancelled = output<void>();

  private readonly fb = new FormBuilder();

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    description: [''],
    package: [null as number | null, Validators.required],
    departureDate: ['', Validators.required],
    capacity: [null as number | null, [Validators.required, Validators.min(1)]]
  });

  /** Cupos ya ocupados por reservas. Solo aplica al editar. */
  readonly reserved = computed(() => {
    const current = this.departure();
    return current
      ? Math.max(current.capacity - current.availableCapacity, 0)
      : 0;
  });

  /** Paquetes activos, más el paquete actual de la salida si está inactivo. */
  readonly selectablePackages = computed(() => {
    const currentPackage = this.departure()?.package;
    return this.packages().filter(
      (item) => item.status === 'active' || item.id === currentPackage
    );
  });

  constructor() {
    effect(() => {
      const current = this.departure();
      this.resetKey();

      if (current) {
        this.form.reset({
          name: current.name,
          description: current.description ?? '',
          package: current.package,
          departureDate: toDateTimeInput(current.departureDate),
          capacity: current.capacity
        });
      } else {
        this.form.reset({
          name: '',
          description: '',
          package: null,
          departureDate: '',
          capacity: null
        });
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const capacity = Number(value.capacity);

    if (capacity < this.reserved()) {
      this.form.controls.capacity.setErrors({ belowReserved: true });
      this.form.controls.capacity.markAsTouched();
      return;
    }

    const payload: CreateDeparture = {
      name: value.name!.trim(),
      description: value.description?.trim() || null,
      package: Number(value.package),
      departureDate: new Date(value.departureDate!).toISOString(),
      capacity,
      availableCapacity: capacity - this.reserved()
    };

    this.saved.emit(payload);
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
