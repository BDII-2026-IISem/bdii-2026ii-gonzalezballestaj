import { TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ConfirmationService } from 'primeng/api';
import { of } from 'rxjs';

import { UserList } from './user-list';
import { UserApi } from '../../security-api';
import { NotificationService } from '../../../../core/services/notification.service';
import { SessionStore } from '../../../../core/services/session-store';
import { User } from '../../../../core/models/security.model';
import { EffectivePermission } from '../../../../core/models/auth.model';

const USUARIO: User = {
  id: 3,
  username: 'Rafael',
  email: 'rafael@gmail.com',
  firstName: '',
  lastName: '',
  status: 'active',
  createdAt: '2026-10-12T00:00:00-05:00',
  updatedAt: '2026-10-12T00:00:00-05:00',
};

const PERMISOS: EffectivePermission[] = [
  { method: 'GET', path: '/api/clients/', roleId: 3, roleName: 'vendedor' },
  { method: 'GET', path: '/api/clients/:id/', roleId: 3, roleName: 'vendedor' },
];

describe('UserList', () => {
  it('pinta una fila por permiso en el diálogo', async () => {
    await TestBed.configureTestingModule({
      imports: [UserList],
      providers: [
        provideAnimationsAsync('noop'),
        ConfirmationService,
        { provide: UserApi, useValue: { list: () => of([USUARIO]), permissions: () => of(PERMISOS) } },
        { provide: NotificationService, useValue: { success() {}, warning() {}, error() {} } },
        { provide: SessionStore, useValue: { canPermission: () => true } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(UserList);
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.componentInstance.openPermissions(USUARIO);
    fixture.detectChanges();
    await fixture.whenStable();

    const filas = document.querySelectorAll('[data-testid="permisos"] tbody tr');
    expect(filas.length).toBe(2);
    expect(filas[0].textContent).toContain('/api/clients/');
    expect(filas[0].textContent).toContain('vendedor');
  });
});
