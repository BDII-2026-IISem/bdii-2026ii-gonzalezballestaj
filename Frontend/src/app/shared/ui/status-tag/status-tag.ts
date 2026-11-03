import { Component, computed, input } from '@angular/core';
import { TagModule } from 'primeng/tag';

import { RecordStatus } from '../../../core/models/client.model';

@Component({
  selector: 'app-status-tag',
  standalone: true,
  imports: [TagModule],
  templateUrl: './status-tag.html',
  styleUrl: './status-tag.css',
})
export class StatusTag {
  readonly status = input<RecordStatus>('active');

  readonly label = computed(() =>
    this.status() === 'active' ? 'Activo' : 'Inactivo'
  );

  readonly severity = computed(() =>
    this.status() === 'active' ? 'success' : 'danger'
  );
}