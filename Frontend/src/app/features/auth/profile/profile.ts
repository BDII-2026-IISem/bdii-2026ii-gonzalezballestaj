import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SessionStore } from '../../../core/services/session-store';
import { PageHeader } from '../../../shared/ui/page-header/page-header';

@Component({
  selector: 'app-profile',
  standalone: true,
  host: { class: 'block' },
  imports: [
    RouterLink,
    ButtonModule,
    CardModule,
    TableModule,
    TagModule,
    PageHeader,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private readonly auth = inject(AuthService);
  private readonly notify = inject(NotificationService);
  private readonly router = inject(Router);

  readonly session = inject(SessionStore);
  readonly refreshing = signal(false);

  readonly fullName = computed(() => {
    const user = this.session.user();
    const name = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
    return name || 'Sin nombre registrado';
  });

  /** Vuelve a pedir /auth/profile/ y /auth/permissions/ sin cerrar la sesión. */
  refresh(): void {
    this.refreshing.set(true);

    this.auth.me().subscribe({
      next: () => {
        this.refreshing.set(false);
        this.notify.success('Perfil y permisos actualizados.', 'Sesión sincronizada');
      },
      error: () => this.refreshing.set(false),
    });
  }

  logout(): void {
    this.auth.logout().subscribe({
      complete: () => {
        this.notify.info('Hasta pronto.', 'Sesión cerrada');
        void this.router.navigate(['/login']);
      },
    });
  }
}
