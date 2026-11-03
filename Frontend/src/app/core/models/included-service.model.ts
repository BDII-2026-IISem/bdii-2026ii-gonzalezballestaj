import type { RecordStatus } from './client.model';

export interface IncludedService {
  id: number;
  package: number;
  supplier: number;
  relationData: Record<string, unknown> | null;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateIncludedService = Pick<
  IncludedService,
  'package' | 'supplier' | 'relationData'
>;

export type UpdateIncludedService = Partial<CreateIncludedService>;