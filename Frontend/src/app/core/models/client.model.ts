import type { Status, Timestamps } from './api.model';

export type RecordStatus = Status;

export interface Client extends Timestamps {
  id: number;
  documentType: string;
  documentNumber: string;
  name: string;
  phone: string | null;
  email: string | null;
  status: Status;
}

export interface ClientPayload {
  documentType: string;
  documentNumber: string;
  name: string;
  phone: string | null;
  email: string | null;
}

// Compatibilidad con los nombres anteriores.
export type CreateClient = ClientPayload;
export type UpdateClient = Partial<ClientPayload>;
