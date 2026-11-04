import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

import { Cancellation } from '../../../../core/models/cancellation.model';
import { CancellationService } from '../../../../core/services/cancellation.service';
import { NotificationService } from '../../../../core/services/notification.service';

import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';

@Component({
  selector: 'app-cancellation-list',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    RouterLink,
    InputTextModule,
    TableModule,
    PageHeader,
    EmptyState,
    StatusTag,
  ],
  templateUrl: './cancellation-list.html',
  styleUrl: './cancellation-list.css',
})
export class CancellationList {
  private readonly cancellationService = inject(CancellationService);
  private readonly notification = inject(NotificationService);

  readonly rows = signal<Cancellation[]>([]);
  readonly search = signal('');
  readonly loading = signal(false);

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

    this.cancellationService.getAll().subscribe({
      next: (data) => {
        this.rows.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notification.error('Error al cargar las cancelaciones.');
      },
    });
  }

  updateSearch(value: string): void {
    this.search.set(value);
  }
}
