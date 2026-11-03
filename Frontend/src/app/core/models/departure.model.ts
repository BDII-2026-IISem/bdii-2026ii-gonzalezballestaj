import type { RecordStatus } from './client.model';

export interface Departure {
  id: number;
  name: string;
  description: string | null;
  package: number;
  departureDate: string;
  capacity: number;
  availableCapacity: number;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateDeparture = Pick<
  Departure,
  | 'name'
  | 'description'
  | 'package'
  | 'departureDate'
  | 'capacity'
  | 'availableCapacity'
>;

export type UpdateDeparture = Partial<CreateDeparture>;