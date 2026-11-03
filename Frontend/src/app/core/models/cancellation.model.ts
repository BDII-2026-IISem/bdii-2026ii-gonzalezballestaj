import type { RecordStatus } from './client.model';

export interface Cancellation {
  id: number;
  booking: number;
  name: string;
  descriptions: string | null;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateCancellation = Pick<
  Cancellation,
  'booking' | 'name' | 'descriptions'
>;

export type UpdateCancellation = Partial<CreateCancellation>;