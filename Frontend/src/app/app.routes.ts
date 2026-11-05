import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';
import { authOnlyGuard } from './core/guards/auth-only-guard';
import { guestGuard } from './core/guards/guest-guard';
import { permissionGuard } from './core/guards/permission-guard';

export const routes: Routes = [
  {
    path: 'construir',
    loadComponent: () =>
      import('./features/construir/construir').then((m) => m.Construir),
  },
  {
    path: 'login',
    title: 'Iniciar sesión · WayuuTravel',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.Dashboard),
        data: {
          permission: 'GET /api/sale/bookings',
          title: 'Panel de control',
          description: 'Actividad del día en Wayuu Travel.',
        },
      },
      {
        path: 'perfil',
        canActivate: [authOnlyGuard],
        loadComponent: () =>
          import('./features/auth/profile/profile').then((m) => m.Profile),
        data: {
          title: 'Mi sesión',
          description: 'Usuario, roles y permisos de la sesión actual.',
        },
      },
      {
        path: 'forbidden',
        loadComponent: () =>
          import('./features/auth/forbidden/forbidden').then((m) => m.Forbidden),
        data: {
          title: 'Acceso denegado',
          description: 'Falta un permiso para abrir esta pantalla.',
        },
      },
      {
        path: 'clientes',
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('./features/clients/client-list/client-list').then(
            (m) => m.ClientList
          ),
        data: {
          permission: 'GET /api/clients',
          title: 'Clientes',
          description: 'Gestión de los clientes de WayuuTravel.',
        },
      },
      {
        path: 'paquetes',
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('./features/packages/pages/package-list/package-list').then(
            (m) => m.PackageList
          ),
        data: {
          permission: 'GET /api/product/packages',
          title: 'Paquetes turísticos',
          description: 'Administración de los paquetes turísticos.',
        },
      },
      {
        path: 'salidas',
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('./features/departures/pages/departure-list/departure-list').then(
            (m) => m.DepartureList
          ),
        data: {
          permission: 'GET /api/product/departures',
          title: 'Salidas',
          description: 'Gestión de las salidas y fechas de los paquetes.',
        },
      },
      {
        path: 'proveedores',
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('./features/suppliers/pages/supplier-list/supplier-list').then(
            (m) => m.SupplierList
          ),
        data: {
          permission: 'GET /api/product/suppliers',
          title: 'Proveedores',
          description: 'Administración de los proveedores turísticos.',
        },
      },
      {
        path: 'reservas',
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('./features/bookings/booking-list/booking-list').then(
            (m) => m.BookingList
          ),
        data: {
          permission: 'GET /api/sale/bookings',
          title: 'Reservas',
          description: 'Gestión de las reservas de los viajeros.',
        },
      },
      {
        path: 'reservas/:id',
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('./features/bookings/booking-detail/booking-detail').then(
            (m) => m.BookingDetail
          ),
        data: {
          permission: 'GET /api/sale/bookings/:id',
          title: 'Detalle de reserva',
          description: 'Consulta detallada de una reserva turística.',
        },
      },
      {
        path: 'pagos',
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('./features/payments/payment-list/payment-list').then(
            (m) => m.PaymentList
          ),
        data: {
          permission: 'GET /api/sale/payments',
          title: 'Pagos',
          description: 'Pagos registrados y su reserva.',
        },
      },
      {
        path: 'cancelaciones',
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('./features/cancellations/pages/cancellation-list/cancellation-list').then(
            (m) => m.CancellationList
          ),
        data: {
          permission: 'GET /api/sale/cancellations',
          title: 'Cancelaciones',
          description: 'Consulta de las cancelaciones de reservas.',
        },
      },
      {
        path: 'comprobantes',
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('./features/vouchers/pages/voucher-list/voucher-list').then(
            (m) => m.VoucherList
          ),
        data: {
          permission: 'GET /api/sale/vouchers',
          title: 'Comprobantes',
          description: 'Emisión y consulta de los comprobantes de las reservas.',
        },
      },
      {
        path: 'admin/usuarios',
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('./features/admin/users/user-list/user-list').then(
            (m) => m.UserList
          ),
        data: {
          permission: 'GET /api/users',
          title: 'Usuarios',
          description: 'Personas que pueden iniciar sesión en Wayuu Travel.',
        },
      },
      {
        path: 'admin/roles',
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('./features/admin/roles/role-list/role-list').then(
            (m) => m.RoleList
          ),
        data: {
          permission: 'GET /api/roles',
          title: 'Roles',
          description: 'Agrupaciones de permisos que se asignan a los usuarios.',
        },
      },
      {
        path: 'admin/recursos',
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('./features/admin/resources/resource-list/resource-list').then(
            (m) => m.ResourceList
          ),
        data: {
          permission: 'GET /api/resources',
          title: 'Recursos',
          description: 'Operaciones de la API protegidas por el RBAC.',
        },
      },
      {
        path: 'admin/asignaciones',
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('./features/admin/role-users/role-user-list/role-user-list').then(
            (m) => m.RoleUserList
          ),
        data: {
          permission: 'GET /api/role-users',
          title: 'Asignaciones',
          description: 'A quién se le da cada rol.',
        },
      },
      {
        path: 'admin/permisos',
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('./features/admin/resource-roles/resource-role-list/resource-role-list').then(
            (m) => m.ResourceRoleList
          ),
        data: {
          permission: 'GET /api/resource-roles',
          title: 'Concesiones',
          description: 'Qué puede hacer cada rol. Cada fila es un permiso.',
        },
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];