import type { RecordStatus } from './client.model';

export interface Package {
  id: number;
  name: string;
  description: string | null;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreatePackage = Pick<
  Package,
  'name' | 'description'
>;

export type UpdatePackage = Partial<CreatePackage>;