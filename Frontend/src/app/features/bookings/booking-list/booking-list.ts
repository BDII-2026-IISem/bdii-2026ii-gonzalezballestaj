import {
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { forkJoin, finalize } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { Booking } from '../../../core/models/booking.model';
import { Client } from '../../../core/models/client.model';
import { Departure } from '../../../core/models/departure.model';

import { BookingService } from '../../../core/services/booking.service';
import { ClientService } from '../../../core/services/client.service';
import { DepartureService } from '../../../core/services/departure.service';

import {
  BookingForm,
  BookingPayload
} from '../booking-form/booking-form';

import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [
  ButtonModule,
  DialogModule,
  InputTextModule,
  TableModule,
  ToastModule,
  RouterLink,
  PageHeader,
  EmptyState,
  StatusTag,
  BookingForm
],
  templateUrl: './booking-list.html',
  styleUrl: './booking-list.css'
})
export class BookingList implements OnInit {
  private readonly bookingService = inject(BookingService);
  private readonly clientService = inject(ClientService);
  private readonly departureService = inject(DepartureService);
  private readonly messageService = inject(MessageService);

  readonly rows = signal<Booking[]>([]);
  readonly clients = signal<Client[]>([]);
  readonly departures = signal<Departure[]>([]);

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly filter = signal('');
  readonly dialogVisible = signal(false);

  readonly visibleRows = computed(() => {
    const term = this.filter().trim().toLowerCase();

    if (!term) {
      return this.rows();
    }

    return this.rows().filter((booking) => {
      const client = this.getClientName(booking.client);
      const departure = this.getDepartureName(booking.departure);

      return [
        booking.id,
        client,
        departure,
        booking.startDate,
        booking.endDate,
        booking.status
      ].some((value) =>
        String(value ?? '').toLowerCase().includes(term)
      );
    });
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      bookings: this.bookingService.getAll(),
      clients: this.clientService.list(),
      departures: this.departureService.getAll()
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (result) => {
          this.rows.set(result.bookings);
          this.clients.set(result.clients);
          this.departures.set(result.departures);
        },
        error: () => {
          this.error.set(
            'No fue posible cargar las reservas y sus datos relacionados.'
          );
        }
      });
  }

  openCreate(): void {
    this.dialogVisible.set(true);
  }

  closeDialog(): void {
    if (!this.saving()) {
      this.dialogVisible.set(false);
    }
  }

  save(payload: BookingPayload): void {
    this.saving.set(true);

    this.bookingService.register(payload)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.dialogVisible.set(false);

          this.messageService.add({
            severity: 'success',
            summary: 'Reserva registrada',
            detail: 'La reserva se registró correctamente.'
          });

          this.load();
        },
        error: (error) => {
          const detail =
            error?.error?.detail ||
            'No fue posible registrar la reserva. Verifica los datos ingresados.';

          this.messageService.add({
            severity: 'error',
            summary: 'Error al registrar',
            detail
          });
        }
      });
  }

  getClientName(id: number): string {
    return this.clients().find((client) => client.id === id)?.name
      ?? `Cliente #${id}`;
  }

  getDepartureName(id: number): string {
    return this.departures().find((departure) => departure.id === id)?.name
      ?? `Salida #${id}`;
  }
}