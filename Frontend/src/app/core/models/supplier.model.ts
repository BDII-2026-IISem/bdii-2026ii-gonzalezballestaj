import type { RecordStatus } from './client.model';

export interface Supplier {
  id: number;
  nit: string;
  razonSocial: string;
  phone: string | null;
  email: string | null;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateSupplier = Pick<
  Supplier,
  'nit' | 'razonSocial' | 'phone' | 'email'
>;

export type UpdateSupplier = Partial<CreateSupplier>;