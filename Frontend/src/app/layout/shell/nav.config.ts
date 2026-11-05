export interface NavItem {
  label: string;
  icon: string;
  routerLink: string;
  /** Clave MÉTODO /api/recurso; sin permiso, la entrada siempre se ve. */
  permission?: string;
}

export interface NavGroup {
  /** Sin etiqueta: sus entradas van sueltas al principio del menú. */
  label?: string;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    items: [
      { label: 'Panel de control', icon: 'pi pi-chart-bar', routerLink: '/dashboard', permission: 'GET /api/sale/bookings' },
      { label: 'Mi sesión', icon: 'pi pi-user', routerLink: '/perfil' },
    ],
  },
  {
    label: 'Gestión turística',
    items: [
      { label: 'Clientes', icon: 'pi pi-users', routerLink: '/clientes', permission: 'GET /api/clients' },
      { label: 'Paquetes turísticos', icon: 'pi pi-map', routerLink: '/paquetes', permission: 'GET /api/product/packages' },
      { label: 'Salidas', icon: 'pi pi-calendar', routerLink: '/salidas', permission: 'GET /api/product/departures' },
      { label: 'Proveedores', icon: 'pi pi-truck', routerLink: '/proveedores', permission: 'GET /api/product/suppliers' },
    ],
  },
  {
    label: 'Gestión comercial',
    items: [
      { label: 'Reservas', icon: 'pi pi-book', routerLink: '/reservas', permission: 'GET /api/sale/bookings' },
      { label: 'Pagos', icon: 'pi pi-wallet', routerLink: '/pagos', permission: 'GET /api/sale/payments' },
      { label: 'Cancelaciones', icon: 'pi pi-times-circle', routerLink: '/cancelaciones', permission: 'GET /api/sale/cancellations' },
      { label: 'Comprobantes', icon: 'pi pi-file', routerLink: '/comprobantes', permission: 'GET /api/sale/vouchers' },
    ],
  },
  {
    label: 'Seguridad',
    items: [
      { label: 'Usuarios', icon: 'pi pi-user-edit', routerLink: '/admin/usuarios', permission: 'GET /api/users' },
      { label: 'Roles', icon: 'pi pi-id-card', routerLink: '/admin/roles', permission: 'GET /api/roles' },
      { label: 'Recursos', icon: 'pi pi-server', routerLink: '/admin/recursos', permission: 'GET /api/resources' },
      { label: 'Asignaciones', icon: 'pi pi-link', routerLink: '/admin/asignaciones', permission: 'GET /api/role-users' },
      { label: 'Concesiones', icon: 'pi pi-key', routerLink: '/admin/permisos', permission: 'GET /api/resource-roles' },
    ],
  },
];

/** Filtra el catálogo con el predicado de la sesión; sin Angular, para poder probarlo. */
export function visibleNav(can: (permission: string) => boolean): NavGroup[] {
  return NAV.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.permission || can(item.permission)),
  })).filter((group) => group.items.length > 0);
}