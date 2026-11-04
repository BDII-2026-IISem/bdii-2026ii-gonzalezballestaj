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

import { Client, ClientPayload } from '../../../core/models/client.model';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './client-form.html',
  styleUrl: './client-form.css'
})
export class ClientForm {
  readonly client = input<Client | null>(null);
  readonly saving = input(false);
  readonly resetKey = input(0);

  readonly saved = output<ClientPayload>();
  readonly cancelled = output<void>();

  readonly documentTypes = ['CC', 'CE', 'TI', 'PAS', 'NIT'];

  private readonly fb = new FormBuilder();

  readonly form = this.fb.group({
    documentType: ['CC', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    documentNumber: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    phone: ['', [Validators.maxLength(30)]],
    email: ['', [Validators.email, Validators.maxLength(150)]]
  });

  constructor() {
    effect(() => {
      const client = this.client();
      this.resetKey();

      if (client) {
        this.form.reset({
          documentType: client.documentType,
          documentNumber: client.documentNumber,
          name: client.name,
          phone: client.phone ?? '',
          email: client.email ?? ''
        });
      } else {
        this.form.reset({
          documentType: 'CC',
          documentNumber: '',
          name: '',
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

    const payload: ClientPayload = {
      documentType: value.documentType!.trim().toUpperCase(),
      documentNumber: value.documentNumber!.trim(),
      name: value.name!.trim(),
      phone: value.phone?.trim() || null,
      email: value.email?.trim() || null
    };

    this.saved.emit(payload);
  }

  cancel(): void {
    this.cancelled.emit();
  }
}