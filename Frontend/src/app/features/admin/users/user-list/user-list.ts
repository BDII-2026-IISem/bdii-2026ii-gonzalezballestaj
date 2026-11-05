import { Component, computed, inject, signal } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { STATUS_OPTIONS, Status } from '../../../../core/models/api.model';
import { EffectivePermission } from '../../../../core/models/auth.model';
import { User, UserPayload } from '../../../../core/models/security.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { filterRows } from '../../../../core/utils/filter-rows';
import { methodSeverity } from '../../../../core/utils/http-method';
import { toApiMessage } from '../../../../core/utils/to-api-message';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { UserApi } from '../../security-api';

@Component({
  selector: 'app-user-list',
  standalone: true,
  host: { class: 'block' },
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    InputTextModule,
    PasswordModule,
    SelectModule,
    TableModule,
    TagModule,
    EmptyState,
    PageHeader,
    StatusTag,
    HasPermission,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {
  private readonly api = inject(UserApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly statusOptions = STATUS_OPTIONS;
  readonly methodSeverity = methodSeverity;

  readonly rows = signal<User[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly filter = signal('');

  readonly dialogVisible = signal(false);
  readonly editing = signal<User | null>(null);

  readonly permissionsUser = signal<User | null>(null);
  readonly permissions = signal<EffectivePermission[]>([]);
  readonly permissionsLoading = signal(false);

  readonly form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    email: ['', [Validators.required, Validators.email]],
    firstName: [''],
    lastName: [''],
    password: ['', [Validators.required, Validators.minLength(8)]],
    status: ['active' as Status, [Validators.required]],
  });

  /** computed: escribir en el buscador no genera peticiones. */
  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (row) => [
      row.username,
      row.email,
      row.firstName,
      row.lastName,
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
        this.notify.error('No fue posible cargar los usuarios.');
      },
    });
  }

  fullName(row: User): string {
    return `${row.firstName} ${row.lastName}`.trim() || 'Sin nombre';
  }

  openCreate(): void {
    this.editing.set(null);
    this.resetForm(null);
    this.dialogVisible.set(true);
  }

  openEdit(row: User): void {
    this.editing.set(row);
    this.resetForm(row);
    this.dialogVisible.set(true);
  }

  /** Al editar, la contraseña se deshabilita: el PATCH no la lleva. */
  private resetForm(row: User | null): void {
    this.form.reset({
      username: row?.username ?? '',
      email: row?.email ?? '',
      firstName: row?.firstName ?? '',
      lastName: row?.lastName ?? '',
      password: '',
      status: row?.status ?? 'active',
    });

    if (row) {
      this.form.controls.password.disable();
    } else {
      this.form.controls.password.enable();
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: UserPayload = {
      username: value.username.trim(),
      email: value.email.trim(),
      firstName: value.firstName.trim(),
      lastName: value.lastName.trim(),
      status: value.status,
    };

    if (!this.editing()) {
      payload.password = value.password;
    }

    this.save(payload);
  }

  private save(payload: UserPayload): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current
      ? this.api.update(current.id, payload)
      : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Usuario actualizado.' : 'Usuario creado.');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error(toApiMessage(error), 'No se pudo guardar');
      },
    });
  }

  confirmDeactivate(row: User): void {
    this.confirmation.confirm({
      header: 'Confirmar desactivación',
      message: `¿Desactivar al usuario "${row.username}"? No podrá iniciar sesión.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () =>
        this.api.remove(row.id).subscribe({
          next: () => {
            this.notify.success('Usuario desactivado.');
            this.load();
          },
          error: (error: unknown) => this.notify.error(toApiMessage(error)),
        }),
    });
  }

  reactivate(row: User): void {
    this.api.update(row.id, { status: 'active' }).subscribe({
      next: () => {
        this.notify.success('Usuario reactivado.');
        this.load();
      },
      error: (error: unknown) => this.notify.error(toApiMessage(error)),
    });
  }

  /** Qué filas sostienen a este usuario: la forma más rápida de diagnosticar un 403. */
  openPermissions(row: User): void {
    this.permissionsUser.set(row);
    this.permissions.set([]);
    this.permissionsLoading.set(true);

    this.api.permissions(row.id).subscribe({
      next: (rows) => {
        this.permissions.set(rows);
        this.permissionsLoading.set(false);
      },
      error: (error: unknown) => {
        this.permissionsLoading.set(false);
        this.notify.error(toApiMessage(error), 'No se pudieron leer los permisos');
      },
    });
  }

  closePermissions(visible: boolean): void {
    if (!visible) {
      this.permissionsUser.set(null);
    }
  }
}
