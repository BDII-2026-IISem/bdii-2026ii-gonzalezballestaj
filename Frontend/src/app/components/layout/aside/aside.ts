
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [PanelMenu],
  templateUrl: './aside.html',
  styleUrl: './aside.css'
})
export class Aside {
  items: MenuItem[] = [
    {
      label: 'Client',
      icon: 'pi pi-fw pi-users',
      items: [
        {
  label: 'Client',
  icon: 'pi pi-fw pi-user',
  routerLink: '/clientes'
},
        {
          label: 'Traveler',
          icon: 'pi pi-fw pi-users',
          routerLink: '/viajeros'
        }
      ]
    },
    {
      label: 'Product',
      icon: 'pi pi-fw pi-box',
      items: [
        {
          label: 'Package',
          icon: 'pi pi-fw pi-ticket',
          routerLink: '/paquetes'
        },
        {
          label: 'Departure',
          icon: 'pi pi-fw pi-calendar',
          routerLink: '/salidas'
        },
        {
          label: 'Suppliers',
          icon: 'pi pi-fw pi-truck',
          routerLink: '/proveedores'
        }
      ]
    },
    {
      label: 'Sale',
      icon: 'pi pi-fw pi-shopping-cart',
      items: [
        {
          label: 'Booking',
          icon: 'pi pi-fw pi-calendar-check',
          routerLink: '/reservas'
        },
        {
          label: 'Payment',
          icon: 'pi pi-fw pi-credit-card',
          routerLink: '/pagos'
        },
        {
          label: 'Cancellations',
          icon: 'pi pi-fw pi-ban',
          routerLink: '/cancelaciones'
        },
        {
          label: 'Voucher',
          icon: 'pi pi-fw pi-ticket',
          routerLink: '/vouchers'
        }
      ]
    }
  ];
}
