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

import { STATUS_OPTIONS, Status } from '../../../../core/models/api.model';
import { Role, RolePayload } from '../../../../core/models/security.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { filterRows } from '../../../../core/utils/filter-rows';
import { toApiMessage } from '../../../../core/utils/to-api-message';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { RoleApi } from '../../security-api';

@Component({
  selector: 'app-role-list',
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
    EmptyState,
    PageHeader,
    StatusTag,
    HasPermission,
  ],
  templateUrl: './role-list.html',
  styleUrl: './role-list.css',
})
export class RoleList {
  private readonly api = inject(RoleApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly statusOptions = STATUS_OPTIONS;

  readonly rows = signal<Role[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly filter = signal('');

  readonly dialogVisible = signal(false);
  readonly editing = signal<Role | null>(null);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(255)]],
    status: ['active' as Status, [Validators.required]],
  });

  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (row) => [row.name, row.description])
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
        this.notify.error('No fue posible cargar los roles.');
      },
    });
  }

  openCreate(): void {
    this.editing.set(null);
    this.form.reset({ name: '', description: '', status: 'active' });
    this.dialogVisible.set(true);
  }

  openEdit(row: Role): void {
    this.editing.set(row);
    this.form.reset({
      name: row.name,
      description: row.description ?? '',
      status: row.status,
    });
    this.dialogVisible.set(true);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: RolePayload = {
      name: value.name.trim().toLowerCase(),
      description: value.description.trim() || null,
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
        this.notify.success(current ? 'Rol actualizado.' : 'Rol creado.');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error(toApiMessage(error), 'No se pudo guardar');
      },
    });
  }

  confirmDeactivate(row: Role): void {
    this.confirmation.confirm({
      header: 'Confirmar desactivación',
      message: `¿Desactivar el rol "${row.name}"? Sus usuarios perderán los permisos que concede.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () =>
        this.api.remove(row.id).subscribe({
          next: () => {
            this.notify.success('Rol desactivado.');
            this.load();
          },
          error: (error: unknown) => this.notify.error(toApiMessage(error)),
        }),
    });
  }

  reactivate(row: Role): void {
    this.api.update(row.id, { status: 'active' }).subscribe({
      next: () => {
        this.notify.success('Rol reactivado.');
        this.load();
      },
      error: (error: unknown) => this.notify.error(toApiMessage(error)),
    });
  }
}
