import {
  Component,
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

import {
  Supplier,
  CreateSupplier
} from '../../../../core/models/supplier.model';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './supplier-form.html',
  styleUrl: './supplier-form.css'
})
export class SupplierForm {
  readonly supplier = input<Supplier | null>(null);
  readonly saving = input(false);
  readonly resetKey = input(0);

  readonly saved = output<CreateSupplier>();
  readonly cancelled = output<void>();

  private readonly fb = new FormBuilder();

  readonly form = this.fb.group({
    nit: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
    razonSocial: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    phone: ['', [Validators.maxLength(30)]],
    email: ['', [Validators.email, Validators.maxLength(150)]]
  });

  constructor() {
    effect(() => {
      const current = this.supplier();
      this.resetKey();

      if (current) {
        this.form.reset({
          nit: current.nit,
          razonSocial: current.razonSocial,
          phone: current.phone ?? '',
          email: current.email ?? ''
        });
      } else {
        this.form.reset({
          nit: '',
          razonSocial: '',
          phone: '',
          email: ''
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

    const payload: CreateSupplier = {
      nit: value.nit!.trim(),
      razonSocial: value.razonSocial!.trim(),
      phone: value.phone?.trim() || null,
      email: value.email?.trim() || null
    };

    this.saved.emit(payload);
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
