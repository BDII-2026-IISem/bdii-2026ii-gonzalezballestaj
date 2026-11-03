
import { Component, input, output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
  selector: 'app-aside',
  imports: [PanelMenuModule],
  templateUrl: './aside.html',
  styleUrl: './aside.css',
  host: {
    class: 'block h-full',
  },
})
export class Aside {
  readonly appName = input('WayuuTravel');
  readonly items = input<MenuItem[]>([]);

  readonly navigated = output<void>();

  onNavigationClick(event: Event): void {
    const target = event.target as HTMLElement;

    if (target.closest('a, button, [role="button"]')) {
      this.navigated.emit();
    }
  }
}
