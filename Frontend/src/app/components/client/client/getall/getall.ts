
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { Button } from 'primeng/button';
import { ConfirmDialogModule} from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { Tooltip } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Tag } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { Client } from '../../../../service/business/client';
import { ClientResponseI } from '../../../../models/business/client';

@Component({
  selector: 'app-client-getall',
  standalone: true,
  imports: [
    CommonModule,
  RouterModule,
  TableModule,
  ConfirmDialogModule,
  Button,
  Toast,
  Tooltip,
  Tag
  ],
  providers: [
    ConfirmationService,
    MessageService
  ],
  templateUrl: './getall.html',
  styleUrl: './getall.css'
})
export class Getall implements OnInit, OnDestroy {
  clients$: Observable<ClientResponseI[]>;
  loading = false;

  private subscription = new Subscription();

  constructor(
    private clientService: Client,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.clients$ = this.clientService.clients$;
  }

  ngOnInit(): void {
    this.loadClients();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadClients(): void {
    this.loading = true;

    this.subscription.add(
      this.clientService.getAllClients().subscribe({
        next: (response) => {
          console.log('Respuesta del backend:', response);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar clientes:', error);
          console.error('Estado HTTP:', error.status);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.status === 401
              ? 'Debes iniciar sesión para consultar los clientes.'
              : 'No se pudieron cargar los clientes.'
          });

          this.loading = false;
        }
      })
    );
  }

  confirmDelete(client: ClientResponseI): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar a ${client.name}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        if (client.id != null) {
          this.deleteClient(client.id);
        }
      }
    });
  }

  deleteClient(id: number): void {
    this.subscription.add(
      this.clientService.deleteClient(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Cliente eliminado correctamente'
          });

          this.loadClients();
        },
        error: (error) => {
          console.error('Error al eliminar cliente:', error);

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.status === 401
              ? 'Debes iniciar sesión para eliminar clientes.'
              : 'No se pudo eliminar el cliente.'
          });
        }
      })
    );
  }
}
