
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';

import { Header } from '../header/header';
import { Aside } from '../aside/aside';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    Header,
    Aside,
    Footer
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.css'
})
export class Shell {
  readonly menuOpen = signal(true);

  readonly menuItems: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      routerLink: '/inicio'
    },
    {
      separator: true
    },
    {
      label: 'Gestión turística',
      items: [
        {
          label: 'Clientes',
          icon: 'pi pi-users',
          routerLink: '/clientes'
        },
        {
          label: 'Paquetes turísticos',
          icon: 'pi pi-map',
          routerLink: '/paquetes'
        },
        {
          label: 'Salidas',
          icon: 'pi pi-calendar',
          routerLink: '/salidas'
        },
        {
          label: 'Proveedores',
          icon: 'pi pi-truck',
          routerLink: '/proveedores'
        }
      ]
    },
    {
      label: 'Gestión comercial',
      items: [
        {
          label: 'Reservas',
          icon: 'pi pi-book',
          routerLink: '/reservas'
        },
        {
          label: 'Pagos',
          icon: 'pi pi-wallet',
          routerLink: '/pagos'
        },
        {
          label: 'Cancelaciones',
          icon: 'pi pi-times-circle',
          routerLink: '/cancelaciones'
        },
        {
          label: 'Comprobantes',
          icon: 'pi pi-file',
          routerLink: '/comprobantes'
        }
      ]
    }
  ];

  toggleMenu(): void {
    this.menuOpen.update((value) => !value);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
