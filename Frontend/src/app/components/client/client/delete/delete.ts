import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Client } from '../../../../service/business/client';
import { ClientResponseI } from '../../../../models/business/client';

@Component({
  selector: 'app-client-delete',
  standalone: true,
  imports: [CommonModule, Button, Toast],
  providers: [MessageService],
  styleUrl: './delete.css',
  templateUrl: './delete.html',
})
export class Delete implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private clientService = inject(Client);
  private messageService = inject(MessageService);

  client: ClientResponseI | null = null;
  loading = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.clientService.getClientById(id).subscribe({
      next: (client) => (this.client = client),
      error: () => this.router.navigate(['/clientes'])
    });
  }

  confirm(): void {
    if (this.client?.id == null) {
      return;
    }
    this.loading = true;
    // El backend hace borrado lógico: el cliente queda con status inactive.
    this.clientService.deleteClient(this.client.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Cliente eliminado correctamente'
        });
        setTimeout(() => this.router.navigate(['/clientes']), 1000);
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el cliente.'
        });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/clientes']);
  }
}
