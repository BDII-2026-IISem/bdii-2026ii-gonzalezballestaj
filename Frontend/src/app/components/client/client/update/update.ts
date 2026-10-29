import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Client } from '../../../../service/business/client';
import { ClientI } from '../../../../models/business/client';
import { CLIENT_STATUSES, DOCUMENT_TYPES } from '../create/create';

@Component({
  selector: 'app-client-update',
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
  styleUrl: './update.css',
  templateUrl: './update.html',
})
export class Update implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private clientService = inject(Client);
  private messageService = inject(MessageService);

  documentTypes = DOCUMENT_TYPES;
  statuses = CLIENT_STATUSES;
  clientId: number | null = null;
  loading = false;
  loadingData = true;

  form = this.fb.nonNullable.group({
    documentType: ['', Validators.required],
    documentNumber: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    phone: ['', Validators.pattern(/^\d{10,15}$/)],
    email: ['', Validators.email],
    status: ['active' as ClientI['status'], Validators.required]
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/clientes']);
      return;
    }
    this.clientId = id;
    this.loadClient(id);
  }

  loadClient(id: number): void {
    this.clientService.getClientById(id).subscribe({
      next: (client) => {
        this.form.patchValue({
          documentType: client.documentType,
          documentNumber: client.documentNumber,
          name: client.name,
          phone: client.phone ?? '',
          email: client.email ?? '',
          status: client.status
        });
        this.loadingData = false;
      },
      error: () => {
        this.loadingData = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el cliente.'
        });
        setTimeout(() => this.router.navigate(['/clientes']), 1500);
      }
    });
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  onSubmit(): void {
    if (this.form.invalid || this.clientId == null) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const raw = this.form.getRawValue();
    const client: Partial<ClientI> = {
      ...raw,
      phone: raw.phone || null,
      email: raw.email || null
    };

    this.clientService.partialUpdateClient(this.clientId, client).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Cliente actualizado correctamente'
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
            : 'No se pudo actualizar el cliente.'
        });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/clientes']);
  }
}
