import type { RecordStatus } from './client.model';

export interface Traveler {
  id: number;
  name: string;
  description: string | null;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateTraveler = Pick<
  Traveler,
  'name' | 'description'
>;

export type UpdateTraveler = Partial<CreateTraveler>;