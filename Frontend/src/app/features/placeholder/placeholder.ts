import { Component, input } from '@angular/core';

import { PageHeader } from '../../shared/ui/page-header/page-header';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [
    PageHeader,
    EmptyState
  ],
  templateUrl: './placeholder.html',
  styleUrl: './placeholder.css',
})
export class Placeholder {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}