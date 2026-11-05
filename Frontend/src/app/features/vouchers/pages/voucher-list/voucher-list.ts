import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { forkJoin } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import {
  Voucher,
  CreateVoucher,
} from '../../../../core/models/voucher.model';
import { Booking } from '../../../../core/models/booking.model';
import { Client } from '../../../../core/models/client.model';

import { VoucherService } from '../../../../core/services/voucher.service';
import { BookingService } from '../../../../core/services/booking.service';
import { ClientService } from '../../../../core/services/client.service';
import { NotificationService } from '../../../../core/services/notification.service';

import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';

import {
  BookingOption,
  VoucherForm,
} from '../../components/voucher-form/voucher-form';

import { HasPermission } from '../../../../shared/directives/has-permission';

@Component({
  selector: 'app-voucher-list',
  standalone: true,
  imports: [
    HasPermission,
    DatePipe,
    FormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    PageHeader,
    EmptyState,
    StatusTag,
    VoucherForm,
  ],
  templateUrl: './voucher-list.html',
  styleUrl: './voucher-list.css',
})
export class VoucherList {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly voucherService = inject(VoucherService);
  private readonly bookingService = inject(BookingService);
  private readonly clientService = inject(ClientService);
  private readonly notification = inject(NotificationService);

  readonly rows = signal<Voucher[]>([]);
  readonly bookings = signal<Booking[]>([]);
  readonly clients = signal<Client[]>([]);
  readonly search = signal('');
  readonly loading = signal(false);
  readonly saving = signal(false);

  readonly dialogVisible = signal(false);
  readonly selectedVoucher = signal<Voucher | null>(null);
  readonly resetKey = signal(0);

  private readonly clientNames = computed(
    () => new Map(this.clients().map((client) => [client.id, client.name]))
  );

  readonly bookingOptions = computed<BookingOption[]>(() =>
    this.bookings().map((booking) => {
      const clientName =
        this.clientNames().get(booking.client) ?? `Cliente #${booking.client}`;
      const active = booking.status === 'active';

      return {
        id: booking.id,
        label: `Reserva #${booking.id} · ${clientName}${active ? '' : ' (cancelada)'}`,
        active,
      };
    })
  );

  readonly filteredRows = computed(() => {
    const term = this.search().trim().toLowerCase();

    return this.rows().filter((item) =>
      [String(item.booking), item.name].some((value) =>
        value.toLowerCase().includes(term)
      )
    );
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);

    forkJoin({
      vouchers: this.voucherService.getAll(),
      bookings: this.bookingService.getAll(),
      clients: this.clientService.list(),
    }).subscribe({
      next: ({ vouchers, bookings, clients }) => {
        this.rows.set(vouchers);
        this.bookings.set(bookings);
        this.clients.set(clients);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notification.error('Error al cargar los comprobantes.');
      },
    });
  }

  updateSearch(value: string): void {
    this.search.set(value);
  }

  openCreate(): void {
    this.selectedVoucher.set(null);
    this.resetKey.update((value) => value + 1);
    this.dialogVisible.set(true);
  }

  openEdit(item: Voucher): void {
    this.selectedVoucher.set(item);
    this.resetKey.update((value) => value + 1);
    this.dialogVisible.set(true);
  }

  closeDialog(): void {
    this.dialogVisible.set(false);
    this.selectedVoucher.set(null);
  }

  onDialogVisibleChange(visible: boolean): void {
    if (!visible) {
      this.closeDialog();
    }
  }

  save(data: CreateVoucher): void {
    this.saving.set(true);

    const current = this.selectedVoucher();

    const request = current
      ? this.voucherService.update(current.id, {
          name: data.name,
          descriptions: data.descriptions,
        })
      : this.voucherService.create(data);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeDialog();

        this.notification.success(
          current
            ? 'Comprobante actualizado correctamente.'
            : 'Comprobante emitido correctamente.'
        );

        this.load();
      },
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        this.notification.error(
          this.apiMessage(err, 'No fue posible guardar el comprobante.')
        );
      },
    });
  }

  confirmDeactivate(item: Voucher): void {
    this.confirmationService.confirm({
      header: 'Confirmar desactivación',
      message: `¿Deseas desactivar el comprobante "${item.name}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deactivate(item),
    });
  }

  private deactivate(item: Voucher): void {
    this.voucherService.delete(item.id).subscribe({
      next: () => {
        this.notification.success('Comprobante desactivado correctamente.');
        this.load();
      },
      error: (err: HttpErrorResponse) => {
        this.notification.error(
          this.apiMessage(err, 'No fue posible desactivar el comprobante.')
        );
      },
    });
  }

  /** Toma el primer mensaje de validación que envía Django, si existe. */
  private apiMessage(err: HttpErrorResponse, fallback: string): string {
    const body = err.error;

    if (body && typeof body === 'object') {
      const first = Object.values(body)[0];
      const message = Array.isArray(first) ? first[0] : first;

      if (typeof message === 'string' && message) {
        return message;
      }
    }

    return fallback;
  }
}
