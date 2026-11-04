import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { BookingService } from '../../core/services/booking.service';
import { PaymentService } from '../../core/services/payment.service';
import { DepartureService } from '../../core/services/departure.service';
import { ClientService } from '../../core/services/client.service';
import { Departure } from '../../core/models/departure.model';

import {
  computeDashboardStats,
  DashboardStats,
  LOW_CAPACITY_THRESHOLD,
} from './dashboard-stats';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly bookingService = inject(BookingService);
  private readonly paymentService = inject(PaymentService);
  private readonly departureService = inject(DepartureService);
  private readonly clientService = inject(ClientService);

  readonly threshold = LOW_CAPACITY_THRESHOLD;

  loading = signal(true);
  error = signal<string | null>(null);
  stats = signal<DashboardStats<Departure> | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      bookings: this.bookingService.getAll(),
      payments: this.paymentService.getAll(),
      departures: this.departureService.getAll(),
      clients: this.clientService.list(),
    }).subscribe({
      next: ({ bookings, payments, departures, clients }) => {
        this.stats.set(computeDashboardStats(bookings, payments, departures, clients));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No fue posible cargar los indicadores. Verifica la conexión con el servidor.');
        this.loading.set(false);
      },
    });
  }
}