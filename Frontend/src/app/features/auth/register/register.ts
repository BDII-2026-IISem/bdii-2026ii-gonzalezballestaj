import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';

import { AuthService } from '../../../core/services/auth.service';
import { toApiMessage } from '../../../core/utils/to-api-message';

/** Las dos contraseñas deben coincidir. */
function samePassword(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirm')?.value;
  return password && confirm && password !== confirm ? { mismatch: true } : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  host: { class: 'block' },
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    CardModule,
    InputTextModule,
    MessageModule,
    PasswordModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly documentTypes = ['CC', 'CE', 'TI', 'PAS'];
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  /** Errores por campo que devuelve el backend: { username: '…', email: '…' }. */
  readonly fieldErrors = signal<Record<string, string>>({});

  readonly form = this.fb.group(
    {
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm: ['', [Validators.required]],
      documentType: ['CC', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      documentNumber: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      phone: ['', [Validators.maxLength(20)]],
    },
    { validators: samePassword }
  );

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.fieldErrors.set({});

    const value = this.form.getRawValue();

    this.auth
      .register({
        username: value.username.trim(),
        email: value.email.trim(),
        password: value.password,
        documentType: value.documentType.trim(),
        documentNumber: value.documentNumber.trim(),
        name: value.name.trim(),
        phone: value.phone.trim() || null,
      })
      .subscribe({
        next: () => {
          void this.router.navigateByUrl('/');
        },
        error: (err: unknown) => {
          this.loading.set(false);
          this.showErrors(err);
        },
      });
  }

  private showErrors(err: unknown): void {
    const body = err instanceof HttpErrorResponse ? err.error : null;

    if (body && typeof body === 'object' && !('detail' in body)) {
      const errors: Record<string, string> = {};
      for (const [field, messages] of Object.entries(body)) {
        errors[field] = Array.isArray(messages) ? String(messages[0]) : String(messages);
      }
      this.fieldErrors.set(errors);
      this.error.set('Revisa los campos marcados.');
      return;
    }

    this.error.set(toApiMessage(err));
  }
}
