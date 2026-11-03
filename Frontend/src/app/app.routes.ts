import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/shell/shell').then((m) => m.Shell),

    children: [
      {
        path: 'inicio',
        loadComponent: () =>
          import('./features/construir/construir').then(
            (m) => m.Construir
          ),
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./features/clients/client-list/client-list').then(
            (m) => m.ClientList
          ),
        data: {
          title: 'Clientes',
          description: 'Gestión de los clientes de WayuuTravel.',
        },
      },
      {
        path: 'tipos-producto',
        loadComponent: () =>
          import('./features/product-types/product-type-list/product-type-list').then(
            (m) => m.ProductTypeList
          ),
        data: {
          title: 'Tipos de producto',
          description: 'Administración de los tipos de producto.',
        },
      },
      {
        path: 'paquetes',
        loadComponent: () =>
          import('./features/placeholder/placeholder').then(
            (m) => m.Placeholder
          ),
        data: {
          title: 'Paquetes turísticos',
          description: 'Administración de los paquetes turísticos.',
        },
      },
      {
        path: 'salidas',
        loadComponent: () =>
          import('./features/placeholder/placeholder').then(
            (m) => m.Placeholder
          ),
        data: {
          title: 'Salidas',
          description: 'Gestión de las salidas y fechas de los paquetes.',
        },
      },
      {
        path: 'proveedores',
        loadComponent: () =>
          import('./features/placeholder/placeholder').then(
            (m) => m.Placeholder
          ),
        data: {
          title: 'Proveedores',
          description: 'Administración de los proveedores turísticos.',
        },
      },
      {
        path: 'reservas',
        loadComponent: () =>
          import('./features/placeholder/placeholder').then(
            (m) => m.Placeholder
          ),
        data: {
          title: 'Reservas',
          description: 'Gestión de las reservas de los viajeros.',
        },
      },
      {
        path: 'pagos',
        loadComponent: () =>
          import('./features/placeholder/placeholder').then(
            (m) => m.Placeholder
          ),
        data: {
          title: 'Pagos',
          description: 'Consulta y gestión de los pagos registrados.',
        },
      },
      {
        path: 'cancelaciones',
        loadComponent: () =>
          import('./features/placeholder/placeholder').then(
            (m) => m.Placeholder
          ),
        data: {
          title: 'Cancelaciones',
          description: 'Administración de las cancelaciones de reservas.',
        },
      },
      {
        path: 'comprobantes',
        loadComponent: () =>
          import('./features/placeholder/placeholder').then(
            (m) => m.Placeholder
          ),
        data: {
          title: 'Comprobantes',
          description: 'Consulta de los comprobantes de las reservas.',
        },
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inicio',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/inicio',
  },
];