import { Component, computed, inject, signal } from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { forkJoin } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { Resource, ResourceRole, Role } from '../../../../core/models/security.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { filterRows } from '../../../../core/utils/filter-rows';
import { methodSeverity, toClientPath } from '../../../../core/utils/http-method';
import { toApiMessage } from '../../../../core/utils/to-api-message';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { ResourceApi, ResourceRoleApi, RoleApi } from '../../security-api';

@Component({
  selector: 'app-resource-role-list',
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
  templateUrl: './resource-role-list.html',
  styleUrl: './resource-role-list.css',
})
export class ResourceRoleList {
  private readonly api = inject(ResourceRoleApi);
  private readonly roleApi = inject(RoleApi);
  private readonly resourceApi = inject(ResourceApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly methodSeverity = methodSeverity;

  readonly rows = signal<ResourceRole[]>([]);
  readonly roles = signal<Role[]>([]);
  readonly resources = signal<Resource[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly filter = signal('');
  readonly roleFilter = signal<number | null>(null);
  readonly dialogVisible = signal(false);

  readonly form = this.fb.group({
    role: [null as number | null, [Validators.required]],
    resource: [null as number | null, [Validators.required]],
  });

  readonly activeRoles = computed(() => this.roles().filter((r) => r.status === 'active'));

  /** MÉTODO /ruta para leer; el valor enviado es el id. */
  readonly resourceOptions = computed(() =>
    this.resources()
      .filter((r) => r.status === 'active')
      .map((r) => ({ id: r.id, label: `${r.method} ${toClientPath(r.route)}` }))
  );

  readonly visibleRows = computed(() => {
    const role = this.roleFilter();
    const rows = role ? this.rows().filter((r) => r.role === role) : this.rows();

    return filterRows(rows, this.filter(), (row) => [
      this.resourceLabel(row.resource),
      this.roleLabel(row.role),
    ]);
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);

    forkJoin({
      rows: this.api.list(),
      roles: this.roleApi.list(),
      resources: this.resourceApi.list(),
    }).subscribe({
      next: ({ rows, roles, resources }) => {
        this.rows.set(rows);
        this.roles.set(roles);
        this.resources.set(resources);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notify.error('No fue posible cargar las concesiones.');
      },
    });
  }

  resource(id: number): Resource | undefined {
    return this.resources().find((r) => r.id === id);
  }

  resourceMethod(id: number): string {
    return this.resource(id)?.method ?? '—';
  }

  resourcePath(id: number): string {
    const row = this.resource(id);
    return row ? toClientPath(row.route) : `#${id}`;
  }

  resourceLabel(id: number): string {
    return `${this.resourceMethod(id)} ${this.resourcePath(id)}`;
  }

  roleLabel(id: number): string {
    return this.roles().find((r) => r.id === id)?.name ?? `#${id}`;
  }

  openCreate(): void {
    this.form.reset({ role: this.roleFilter(), resource: null });
    this.dialogVisible.set(true);
  }

  submit(): void {
    const value = this.form.getRawValue();

    if (!value.role || !value.resource) {
      this.form.markAllAsTouched();
      return;
    }

    // La pareja rol + recurso es única: reactivar en lugar de insertar otra fila.
    const existing = this.rows().find(
      (r) => r.role === value.role && r.resource === value.resource
    );

    if (existing?.status === 'active') {
      this.notify.warning('Ese rol ya tiene ese permiso.');
      return;
    }

    if (existing) {
      this.dialogVisible.set(false);
      this.reactivate(existing);
      return;
    }

    this.saving.set(true);

    this.api.create({ role: value.role, resource: value.resource, status: 'active' }).subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success('Permiso concedido.');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error(toApiMessage(error), 'No se pudo conceder');
      },
    });
  }

  confirmRevoke(row: ResourceRole): void {
    this.confirmation.confirm({
      header: 'Retirar permiso',
      message: `¿Retirar ${this.resourceLabel(row.resource)} al rol "${this.roleLabel(row.role)}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Retirar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () =>
        this.api.remove(row.id).subscribe({
          next: () => {
            this.notify.success('Permiso retirado.');
            this.load();
          },
          error: (error: unknown) => this.notify.error(toApiMessage(error)),
        }),
    });
  }

  reactivate(row: ResourceRole): void {
    this.api.update(row.id, { status: 'active' }).subscribe({
      next: () => {
        this.notify.success('Permiso reactivado.');
        this.load();
      },
      error: (error: unknown) => this.notify.error(toApiMessage(error)),
    });
  }
}
