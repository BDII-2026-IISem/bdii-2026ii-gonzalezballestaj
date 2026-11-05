import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import {
  Supplier,
  CreateSupplier,
} from '../../../../core/models/supplier.model';

import { SupplierService } from '../../../../core/services/supplier.service';
import { NotificationService } from '../../../../core/services/notification.service';

import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';

import { SupplierForm } from '../../components/supplier-form/supplier-form';

import { HasPermission } from '../../../../shared/directives/has-permission';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [
    HasPermission,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    PageHeader,
    EmptyState,
    StatusTag,
    SupplierForm,
  ],
  templateUrl: './supplier-list.html',
  styleUrl: './supplier-list.css',
})
export class SupplierList {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly supplierService = inject(SupplierService);
  private readonly notification = inject(NotificationService);

  readonly rows = signal<Supplier[]>([]);
  readonly search = signal('');
  readonly loading = signal(false);
  readonly saving = signal(false);

  readonly dialogVisible = signal(false);
  readonly selectedSupplier = signal<Supplier | null>(null);
  readonly resetKey = signal(0);

  readonly filteredRows = computed(() => {
    const term = this.search().trim().toLowerCase();

    return this.rows().filter((item) =>
      [item.nit, item.razonSocial].some((value) =>
        (value ?? '').toLowerCase().includes(term)
      )
    );
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);

    this.supplierService.getAll().subscribe({
      next: (data) => {
        this.rows.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notification.error('Error al cargar los proveedores.');
      },
    });
  }

  updateSearch(value: string): void {
    this.search.set(value);
  }

  openCreate(): void {
    this.selectedSupplier.set(null);
    this.resetKey.update((value) => value + 1);
    this.dialogVisible.set(true);
  }

  openEdit(item: Supplier): void {
    this.selectedSupplier.set(item);
    this.resetKey.update((value) => value + 1);
    this.dialogVisible.set(true);
  }

  closeDialog(): void {
    this.dialogVisible.set(false);
    this.selectedSupplier.set(null);
  }

  onDialogVisibleChange(visible: boolean): void {
    if (!visible) {
      this.closeDialog();
    }
  }

  save(data: CreateSupplier): void {
    this.saving.set(true);

    const current = this.selectedSupplier();

    const request = current
      ? this.supplierService.update(current.id, data)
      : this.supplierService.create(data);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeDialog();

        this.notification.success(
          current
            ? 'Proveedor actualizado correctamente.'
            : 'Proveedor registrado correctamente.'
        );

        this.load();
      },
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        this.notification.error(
          this.apiMessage(err, 'No fue posible guardar el proveedor.')
        );
      },
    });
  }

  confirmDeactivate(item: Supplier): void {
    this.confirmationService.confirm({
      header: 'Confirmar desactivación',
      message: `¿Deseas desactivar el proveedor "${item.razonSocial}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deactivate(item),
    });
  }

  private deactivate(item: Supplier): void {
    this.supplierService.delete(item.id).subscribe({
      next: () => {
        this.notification.success('Proveedor desactivado correctamente.');
        this.load();
      },
      error: (err: HttpErrorResponse) => {
        this.notification.error(
          this.apiMessage(err, 'No fue posible desactivar el proveedor.')
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
