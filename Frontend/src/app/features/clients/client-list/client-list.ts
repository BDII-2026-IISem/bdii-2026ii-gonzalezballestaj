import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { Client, ClientPayload } from '../../../core/models/client.model';
import { ClientService } from '../../../core/services/client.service';
import { NotificationService } from '../../../core/services/notification.service';
import { filterRows } from '../../../core/utils/filter-rows';
import { toApiMessage } from '../../../core/utils/to-api-message';

import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';

import { ClientForm } from '../client-form/client-form';

import { HasPermission } from '../../../shared/directives/has-permission';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    HasPermission,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TableModule,
    TooltipModule,
    PageHeader,
    EmptyState,
    StatusTag,
    ClientForm
  ],
  templateUrl: './client-list.html',
  styleUrl: './client-list.css'
})
export class ClientList implements OnInit {
  private readonly clientService = inject(ClientService);
  private readonly notification = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly rows = signal<Client[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly filter = signal('');
  readonly dialogVisible = signal(false);
  readonly editing = signal<Client | null>(null);
  readonly resetKey = signal(0);

  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (client) => [
      client.id,
      client.name,
      client.documentType,
      client.documentNumber,
      client.phone,
      client.email, 
      client.status
    ])
  );

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.clientService.list()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (clients) => this.rows.set(clients),
        error: (err) => {
          const message = toApiMessage(err);
          this.error.set(message);
          this.notification.error(message);
        }
      });
  }

  openCreate(): void {
    this.editing.set(null);
    this.resetKey.update((value) => value + 1);
    this.dialogVisible.set(true);
  }

  openEdit(client: Client): void {
    this.editing.set(client);
    this.dialogVisible.set(true);
  }

  closeDialog(): void {
    this.dialogVisible.set(false);
    this.editing.set(null);
    this.resetKey.update((value) => value + 1);
  }

  save(payload: ClientPayload): void {
    this.saving.set(true);

    const client = this.editing();

    const request = client
      ? this.clientService.update(client.id, payload)
      : this.clientService.create({
          ...payload,
          status: 'active'
        });

    request
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.notification.success(
            client
              ? 'Cliente actualizado correctamente.'
              : 'Cliente registrado correctamente.'
          );

          this.closeDialog();
          this.load();
        },
        error: (err) => {
          const message = toApiMessage(err);
          this.error.set(message);
          this.notification.error(message);
        }
      });
  }

  confirmDelete(client: Client): void {
    this.confirmation.confirm({
      header: 'Eliminar cliente',
      message: `¿Estás seguro de eliminar a ${client.name}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => this.remove(client)
    });
  }

  private remove(client: Client): void {
    this.clientService.remove(client.id).subscribe({
      next: () => {
        this.rows.update((rows) =>
          rows.filter((row) => row.id !== client.id)
        );

        this.notification.success('Cliente eliminado correctamente.');
      },
      error: (err) => {
        const message = toApiMessage(err);
        this.notification.error(message);
      }
    });
  }
}
