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
import { TextareaModule } from 'primeng/textarea';

import { Client, ClientPayload } from '../../../core/models/client.model';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule
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

  private readonly fb = new FormBuilder();

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    address: [''],
    phone: ['', [Validators.maxLength(30)]],
    email: ['', [Validators.email, Validators.maxLength(150)]]
  });

  constructor() {
    effect(() => {
      const client = this.client();
      this.resetKey();

      if (client) {
        this.form.reset({
          name: client.name,
          address: client.address ?? '',
          phone: client.phone ?? '',
          email: client.email ?? ''
        });
      } else {
        this.form.reset({
          name: '',
          address: '',
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
      name: value.name!.trim(),
      address: value.address?.trim() || null,
      phone: value.phone?.trim() || null,
      email: value.email?.trim() || null
    };

    this.saved.emit(payload);
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
