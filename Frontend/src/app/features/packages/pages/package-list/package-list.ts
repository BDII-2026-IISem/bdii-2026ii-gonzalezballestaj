import {
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import {
  Package,
  CreatePackage,
} from '../../../../core/models/package.model';

import { PackageService } from '../../../../core/services/package.service';
import { NotificationService } from '../../../../core/services/notification.service';

import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';

import { PackageForm } from '../../components/package-form/package-form';

@Component({
  selector: 'app-package-list',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    PageHeader,
    EmptyState,
    StatusTag,
    PackageForm,
  ],
  templateUrl: './package-list.html',
  styleUrl: './package-list.css',
})
export class PackageList {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly packageService = inject(PackageService);
  private readonly notification = inject(NotificationService);

  readonly rows = signal<Package[]>([]);
  readonly search = signal('');
  readonly onlyAvailable = signal(false);
  readonly loading = signal(false);
  readonly saving = signal(false);

  readonly dialogVisible = signal(false);
  readonly selectedPackage = signal<Package | null>(null);

  readonly filteredRows = computed(() => {
    const term = this.search().trim().toLowerCase();

    return this.rows().filter((item) =>
      item.name.toLowerCase().includes(term)
    );
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);

    const request = this.onlyAvailable()
      ? this.packageService.getAvailable()
      : this.packageService.getAll();

    request.subscribe({
      next: (data) => {
        this.rows.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notification.error(
          'Error al cargar los paquetes turísticos.'
        );
      },
    });
  }

  toggleAvailability(): void {
    this.onlyAvailable.update((value) => !value);
    this.load();
  }

  updateSearch(value: string): void {
    this.search.set(value);
  }

  openCreate(): void {
    this.selectedPackage.set(null);
    this.dialogVisible.set(true);
  }

  openEdit(item: Package): void {
    this.selectedPackage.set(item);
    this.dialogVisible.set(true);
  }

  closeDialog(): void {
    this.dialogVisible.set(false);
    this.selectedPackage.set(null);
  }

  save(data: CreatePackage): void {
    this.saving.set(true);

    const current = this.selectedPackage();

    const request = current
      ? this.packageService.update(current.id, data)
      : this.packageService.create(data);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeDialog();

        this.notification.success(
          current
            ? 'Paquete actualizado correctamente.'
            : 'Paquete registrado correctamente.'
        );

        this.load();
      },
      error: () => {
        this.saving.set(false);
        this.notification.error(
          'No fue posible guardar el paquete turístico.'
        );
      },
    });
  }

  confirmDelete(item: Package): void {
    this.confirmationService.confirm({
      header: 'Confirmar desactivación',
      message: `¿Deseas desactivar el paquete "${item.name}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deletePackage(item),
    });
  }

  private deletePackage(item: Package): void {
    this.packageService.delete(item.id).subscribe({
      next: () => {
        this.notification.success(
          'Paquete desactivado correctamente.'
        );
        this.load();
      },
      error: () => {
        this.notification.error(
          'No fue posible desactivar el paquete.'
        );
      },
    });
  }
}