import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { forkJoin } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import {
  Departure,
  CreateDeparture,
} from '../../../../core/models/departure.model';
import { Package } from '../../../../core/models/package.model';

import { DepartureService } from '../../../../core/services/departure.service';
import { PackageService } from '../../../../core/services/package.service';
import { NotificationService } from '../../../../core/services/notification.service';

import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';

import { DepartureForm } from '../../components/departure-form/departure-form';

import { HasPermission } from '../../../../shared/directives/has-permission';

@Component({
  selector: 'app-departure-list',
  standalone: true,
  imports: [
    HasPermission,
    DatePipe,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    PageHeader,
    EmptyState,
    StatusTag,
    DepartureForm,
  ],
  templateUrl: './departure-list.html',
  styleUrl: './departure-list.css',
})
export class DepartureList {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly departureService = inject(DepartureService);
  private readonly packageService = inject(PackageService);
  private readonly notification = inject(NotificationService);

  readonly rows = signal<Departure[]>([]);
  readonly packages = signal<Package[]>([]);
  readonly search = signal('');
  readonly loading = signal(false);
  readonly saving = signal(false);

  readonly dialogVisible = signal(false);
  readonly selectedDeparture = signal<Departure | null>(null);
  readonly resetKey = signal(0);

  private readonly packageNames = computed(
    () => new Map(this.packages().map((item) => [item.id, item.name]))
  );

  readonly filteredRows = computed(() => {
    const term = this.search().trim().toLowerCase();

    return this.rows().filter((item) =>
      [item.name, this.packageName(item.package)].some((value) =>
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
      departures: this.departureService.getAll(),
      packages: this.packageService.getAll(),
    }).subscribe({
      next: ({ departures, packages }) => {
        this.rows.set(departures);
        this.packages.set(packages);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notification.error('Error al cargar las salidas.');
      },
    });
  }

  packageName(id: number): string {
    return this.packageNames().get(id) ?? `Paquete #${id}`;
  }

  updateSearch(value: string): void {
    this.search.set(value);
  }

  openCreate(): void {
    this.selectedDeparture.set(null);
    this.resetKey.update((value) => value + 1);
    this.dialogVisible.set(true);
  }

  openEdit(item: Departure): void {
    this.selectedDeparture.set(item);
    this.resetKey.update((value) => value + 1);
    this.dialogVisible.set(true);
  }

  closeDialog(): void {
    this.dialogVisible.set(false);
    this.selectedDeparture.set(null);
  }

  onDialogVisibleChange(visible: boolean): void {
    if (!visible) {
      this.closeDialog();
    }
  }

  save(data: CreateDeparture): void {
    this.saving.set(true);

    const current = this.selectedDeparture();

    const request = current
      ? this.departureService.update(current.id, data)
      : this.departureService.create(data);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeDialog();

        this.notification.success(
          current
            ? 'Salida actualizada correctamente.'
            : 'Salida registrada correctamente.'
        );

        this.load();
      },
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        this.notification.error(
          this.apiMessage(err, 'No fue posible guardar la salida.')
        );
      },
    });
  }

  confirmDeactivate(item: Departure): void {
    this.confirmationService.confirm({
      header: 'Confirmar desactivación',
      message: `¿Deseas desactivar la salida "${item.name}"? Sus reservas se conservan.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deactivate(item),
    });
  }

  private deactivate(item: Departure): void {
    this.departureService.delete(item.id).subscribe({
      next: () => {
        this.notification.success('Salida desactivada correctamente.');
        this.load();
      },
      error: (err: HttpErrorResponse) => {
        this.notification.error(
          this.apiMessage(err, 'No fue posible desactivar la salida.')
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
