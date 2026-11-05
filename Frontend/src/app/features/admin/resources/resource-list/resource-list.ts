import { Component, computed, inject, signal } from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmationService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { HttpMethod, STATUS_OPTIONS, Status } from '../../../../core/models/api.model';
import { Resource, ResourcePayload } from '../../../../core/models/security.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { filterRows } from '../../../../core/utils/filter-rows';
import { HTTP_METHODS, methodSeverity, toClientPath } from '../../../../core/utils/http-method';
import { toApiMessage } from '../../../../core/utils/to-api-message';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { ResourceApi } from '../../security-api';

@Component({
  selector: 'app-resource-list',
  standalone: true,
  host: { class: 'block' },
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    TableModule,
    TagModule,
    EmptyState,
    PageHeader,
    StatusTag,
    HasPermission,
  ],
  templateUrl: './resource-list.html',
  styleUrl: './resource-list.css',
})
export class ResourceList {
  private readonly api = inject(ResourceApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly statusOptions = STATUS_OPTIONS;
  readonly methods = HTTP_METHODS;
  readonly methodSeverity = methodSeverity;
  readonly toClientPath = toClientPath;

  readonly rows = signal<Resource[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly filter = signal('');

  readonly dialogVisible = signal(false);
  readonly editing = signal<Resource | null>(null);

  readonly form = this.fb.group({
    method: ['GET' as HttpMethod, [Validators.required]],
    // Formato de Django, sin barra inicial: api/clients/ o api/clients/<int:pk>/
    route: ['', [Validators.required, Validators.pattern(/^api\//), Validators.maxLength(255)]],
    status: ['active' as Status, [Validators.required]],
  });

  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (row) => [
      row.method,
      row.route,
      toClientPath(row.route),
      row.name,
    ])
  );

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);

    this.api.list().subscribe({
      next: (rows) => {
        this.rows.set(rows);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notify.error('No fue posible cargar los recursos.');
      },
    });
  }

  openCreate(): void {
    this.editing.set(null);
    this.form.reset({ method: 'GET', route: '', status: 'active' });
    this.dialogVisible.set(true);
  }

  openEdit(row: Resource): void {
    this.editing.set(row);
    this.form.reset({ method: row.method, route: row.route, status: row.status });
    this.dialogVisible.set(true);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const route = value.route.trim();

    const payload: ResourcePayload = {
      name: `${value.method} ${route}`,
      method: value.method,
      route,
      status: value.status,
    };

    const current = this.editing();
    this.saving.set(true);

    const request = current
      ? this.api.update(current.id, payload)
      : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Recurso actualizado.' : 'Recurso creado.');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error(toApiMessage(error), 'No se pudo guardar');
      },
    });
  }

  confirmDeactivate(row: Resource): void {
    this.confirmation.confirm({
      header: 'Confirmar desactivación',
      message: `¿Desactivar ${row.method} ${toClientPath(row.route)}? Nadie podrá ejecutar esa operación.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () =>
        this.api.remove(row.id).subscribe({
          next: () => {
            this.notify.success('Recurso desactivado.');
            this.load();
          },
          error: (error: unknown) => this.notify.error(toApiMessage(error)),
        }),
    });
  }

  reactivate(row: Resource): void {
    this.api.update(row.id, { status: 'active' }).subscribe({
      next: () => {
        this.notify.success('Recurso reactivado.');
        this.load();
      },
      error: (error: unknown) => this.notify.error(toApiMessage(error)),
    });
  }
}
