import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { PaymentService } from '../../../core/services/payment.service';
import { Payment } from '../../../core/models/payment.model';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './payment-list.html',
  styleUrl: './payment-list.css',
})
export class PaymentList implements OnInit {
  private readonly paymentService = inject(PaymentService);

  payments = signal<Payment[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  search = signal('');

  filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) {
      return this.payments();
    }
    return this.payments().filter((p) =>
      [p.id, p.booking, p.referenceType, p.method].some((value) =>
        String(value ?? '').toLowerCase().includes(term)
      )
    );
  });

  bookingsCount = computed(
    () => new Set(this.filtered().map((p) => p.booking)).size
  );

  ngOnInit(): void {
    this.paymentService.getAll().subscribe({
      next: (payments) => {
        this.payments.set(payments);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No fue posible cargar los pagos.');
        this.loading.set(false);
      },
    });
  }
}
