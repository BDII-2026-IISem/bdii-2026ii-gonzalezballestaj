import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'construir',
    loadComponent: () =>
      import('./features/construir/construir').then((m) => m.Construir),
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'clientes',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.Dashboard),
        data: {
          title: 'Panel de control',
          description: 'Actividad del día en Wayuu Travel.',
        },
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./features/clients/client-list/client-list').then(
            (m) => m.ClientList
          ),
        data: {
          title: 'Clientes',
          description: 'Gestión de los clientes de Wayuu Travel.',
        },
      },
      {
        path: 'paquetes',
        loadComponent: () =>
          import('./features/packages/pages/package-list/package-list').then(
            (m) => m.PackageList
          ),
        data: {
          title: 'Paquetes turísticos',
          description: 'Administración de los paquetes turísticos.',
        },
      },
      {
        path: 'salidas',
        loadComponent: () =>
          import('./features/departures/pages/departure-list/departure-list').then(
            (m) => m.DepartureList
          ),
        data: {
          title: 'Salidas',
          description: 'Gestión de las salidas y fechas de los paquetes.',
        },
      },
      {
        path: 'proveedores',
        loadComponent: () =>
         import('./features/suppliers/pages/supplier-list/supplier-list').then(
            (m) => m.SupplierList
          ),
        data: {
          title: 'Proveedores',
          description: 'Administración de los proveedores turísticos.',
        },
      },
      {
        path: 'reservas',
        loadComponent: () =>
          import('./features/bookings/booking-list/booking-list').then(
            (m) => m.BookingList
          ),
        data: {
          title: 'Reservas',
          description: 'Gestión de las reservas de los viajeros.',
        },
      },
      {
        path: 'reservas/:id',
        loadComponent: () =>
          import('./features/bookings/booking-detail/booking-detail').then(
            (m) => m.BookingDetail
          ),
        data: {
          title: 'Detalle de reserva',
          description: 'Consulta detallada de una reserva turística.',
        },
      },
      {
        path: 'pagos',
        loadComponent: () =>
          import('./features/payments/payment-list/payment-list').then(
            (m) => m.PaymentList
          ),
        data: {
          title: 'Pagos',
          description: 'Pagos registrados y su reserva.',
        },
      },
      {
        path: 'cancelaciones',
        loadComponent: () =>
                    import('./features/cancellations/pages/cancellation-list/cancellation-list').then(
            (m) => m.CancellationList
          ),
        data: {
          title: 'Cancelaciones',
          description: 'Administración de las cancelaciones de reservas.',
        },
      },
      {
        path: 'comprobantes',
        loadComponent: () =>
                   import('./features/vouchers/pages/voucher-list/voucher-list').then(
            (m) => m.VoucherList
          ),
        data: {
          title: 'Comprobantes',
          description: 'Consulta de los comprobantes de las reservas.',
        },
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'construir',
  },
];