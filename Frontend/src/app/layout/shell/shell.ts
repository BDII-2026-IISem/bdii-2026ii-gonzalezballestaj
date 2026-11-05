import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';

import { SessionStore } from '../../core/services/session-store';
import { Header } from '../header/header';
import { Aside } from '../aside/aside';
import { Footer } from '../footer/footer';
import { visibleNav } from './nav.config';

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
  private readonly session = inject(SessionStore);

  readonly menuOpen = signal(true);

  /** El menú se deriva de la matriz: cambia sin recargar cuando cambian los permisos. */
  readonly menuItems = computed<MenuItem[]>(() => {
    const result: MenuItem[] = [];

    for (const group of visibleNav((permission) => this.session.canPermission(permission))) {
      const items = group.items.map<MenuItem>((item) => ({
        label: item.label,
        icon: item.icon,
        routerLink: item.routerLink,
      }));

      if (group.label) {
        result.push({ label: group.label, items });
      } else {
        result.push(...items, { separator: true });
      }
    }

    return result;
  });

  toggleMenu(): void {
    this.menuOpen.update((value) => !value);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}