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

import { Role, RoleUser, User } from '../../../../core/models/security.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { filterRows } from '../../../../core/utils/filter-rows';
import { toApiMessage } from '../../../../core/utils/to-api-message';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { RoleApi, RoleUserApi, UserApi } from '../../security-api';

@Component({
  selector: 'app-role-user-list',
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
  templateUrl: './role-user-list.html',
  styleUrl: './role-user-list.css',
})
export class RoleUserList {
  private readonly api = inject(RoleUserApi);
  private readonly userApi = inject(UserApi);
  private readonly roleApi = inject(RoleApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly rows = signal<RoleUser[]>([]);
  readonly users = signal<User[]>([]);
  readonly roles = signal<Role[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly filter = signal('');
  readonly dialogVisible = signal(false);

  readonly form = this.fb.group({
    user: [null as number | null, [Validators.required]],
    role: [null as number | null, [Validators.required]],
  });

  /** Solo usuarios y roles activos se pueden asignar. */
  readonly activeUsers = computed(() => this.users().filter((u) => u.status === 'active'));
  readonly activeRoles = computed(() => this.roles().filter((r) => r.status === 'active'));

  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (row) => [
      this.userLabel(row.user),
      this.roleLabel(row.role),
    ])
  );

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);

    forkJoin({
      rows: this.api.list(),
      users: this.userApi.list(),
      roles: this.roleApi.list(),
    }).subscribe({
      next: ({ rows, users, roles }) => {
        this.rows.set(rows);
        this.users.set(users);
        this.roles.set(roles);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notify.error('No fue posible cargar las asignaciones.');
      },
    });
  }

  userLabel(id: number): string {
    return this.users().find((u) => u.id === id)?.username ?? `#${id}`;
  }

  roleLabel(id: number): string {
    return this.roles().find((r) => r.id === id)?.name ?? `#${id}`;
  }

  openCreate(): void {
    this.form.reset({ user: null, role: null });
    this.dialogVisible.set(true);
  }

  submit(): void {
    const value = this.form.getRawValue();

    if (!value.user || !value.role) {
      this.form.markAllAsTouched();
      return;
    }

    // La pareja usuario + rol es única: reactivar en lugar de insertar otra fila.
    const existing = this.rows().find((r) => r.user === value.user && r.role === value.role);

    if (existing?.status === 'active') {
      this.notify.warning('Ese usuario ya tiene ese rol.');
      return;
    }

    if (existing) {
      this.dialogVisible.set(false);
      this.reactivate(existing);
      return;
    }

    this.saving.set(true);

    this.api.create({ user: value.user, role: value.role, status: 'active' }).subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success('Rol asignado.');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error(toApiMessage(error), 'No se pudo asignar');
      },
    });
  }

  confirmRevoke(row: RoleUser): void {
    this.confirmation.confirm({
      header: 'Retirar rol',
      message: `¿Retirar el rol "${this.roleLabel(row.role)}" a "${this.userLabel(row.user)}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Retirar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () =>
        this.api.remove(row.id).subscribe({
          next: () => {
            this.notify.success('Rol retirado.');
            this.load();
          },
          error: (error: unknown) => this.notify.error(toApiMessage(error)),
        }),
    });
  }

  /** Retirar y volver a conceder es cambiar status: no se inserta otra fila. */
  reactivate(row: RoleUser): void {
    this.api.update(row.id, { status: 'active' }).subscribe({
      next: () => {
        this.notify.success('Asignación reactivada.');
        this.load();
      },
      error: (error: unknown) => this.notify.error(toApiMessage(error)),
    });
  }
}
