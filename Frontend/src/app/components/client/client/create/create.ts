import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Client } from '../../../../service/business/client';
import { ClientI } from '../../../../models/business/client';

export const DOCUMENT_TYPES = [
  { label: 'Cédula de ciudadanía', value: 'CC' },
  { label: 'Cédula de extranjería', value: 'CE' },
  { label: 'Pasaporte', value: 'PAS' },
  { label: 'Tarjeta de identidad', value: 'TI' }
];

export const CLIENT_STATUSES = [
  { label: 'Activo', value: 'active' },
  { label: 'Inactivo', value: 'inactive' }
];

@Component({
  selector: 'app-client-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    Button,
    InputText,
    Select,
    Toast
  ],
  providers: [MessageService],
  styleUrl: './create.css',
  templateUrl: './create.html',
})
export class Create {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private clientService = inject(Client);
  private messageService = inject(MessageService);

  documentTypes = DOCUMENT_TYPES;
  statuses = CLIENT_STATUSES;
  loading = false;

  form = this.fb.nonNullable.group({
    documentType: ['CC', Validators.required],
    documentNumber: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    phone: ['', Validators.pattern(/^\d{10,15}$/)],
    email: ['', Validators.email],
    status: ['active' as ClientI['status'], Validators.required]
  });

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Revisa los campos marcados en rojo.'
      });
      return;
    }

    this.loading = true;
    const raw = this.form.getRawValue();
    const client: ClientI = {
      ...raw,
      phone: raw.phone || null,
      email: raw.email || null
    };

    this.clientService.createClient(client).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Cliente creado correctamente'
        });
        setTimeout(() => this.router.navigate(['/clientes']), 1000);
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.status === 400
            ? 'Datos inválidos o documento/correo ya registrado.'
            : 'No se pudo crear el cliente.'
        });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/clientes']);
  }
}
