import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import {
  ProductType,
  ProductTypePayload
} from '../../../core/models/product-type.model';

import { ProductTypeApi } from '../../../core/services/product-type-api';
import { NotificationService } from '../../../core/services/notification.service';
import { filterRows } from '../../../core/utils/filter-rows';
import { toApiMessage } from '../../../core/utils/to-api-message';

import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';

import { ProductTypeForm } from '../product-type-form/product-type-form';

@Component({
  selector: 'app-product-type-list',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    InputTextModule,
    TableModule,
    TooltipModule,
    PageHeader,
    EmptyState,
    StatusTag,
    ProductTypeForm
  ],
  templateUrl: './product-type-list.html',
  styleUrl: './product-type-list.css'
})
export class ProductTypeList implements OnInit {
  private readonly api = inject(ProductTypeApi);
  private readonly notification = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly rows = signal<ProductType[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly filter = signal('');
  readonly dialogVisible = signal(false);
  readonly editing = signal<ProductType | null>(null);
  readonly resetKey = signal(0);

  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (productType) => [
      productType.id,
      productType.name,
      productType.description,
      productType.status
    ])
  );

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.list('active')
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (types) => this.rows.set(types),
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

  openEdit(productType: ProductType): void {
    this.editing.set(productType);
    this.dialogVisible.set(true);
  }

  closeDialog(): void {
    this.dialogVisible.set(false);
    this.editing.set(null);
    this.resetKey.update((value) => value + 1);
  }

  save(payload: ProductTypePayload): void {
    this.saving.set(true);

    const productType = this.editing();

    const request = productType
      ? this.api.update(productType.id, payload)
      : this.api.create({
          ...payload,
          status: 'active'
        });

    request
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.notification.success(
            productType
              ? 'Tipo de producto actualizado correctamente.'
              : 'Tipo de producto registrado correctamente.'
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

  confirmDeactivate(productType: ProductType): void {
    this.confirmation.confirm({
      header: 'Desactivar tipo de producto',
      message: `¿Estás seguro de desactivar "${productType.name}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      accept: () => this.deactivate(productType)
    });
  }

  private deactivate(productType: ProductType): void {
    this.api.remove(productType.id).subscribe({
      next: () => {
        this.rows.update((rows) =>
          rows.filter((row) => row.id !== productType.id)
        );

        this.notification.success(
          'Tipo de producto desactivado correctamente.'
        );
      },
      error: (err) => {
        const message = toApiMessage(err);
        this.notification.error(message);
      }
    });
  }
}
