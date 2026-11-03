import type { RecordStatus } from './client.model';

export interface Booking {
  id: number;
  client: number;
  departure: number;
  traveler: number;
  startDate: string;
  endDate: string;
  observations: string | null;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateBooking = Pick<
  Booking,
  | 'client'
  | 'departure'
  | 'traveler'
  | 'startDate'
  | 'endDate'
  | 'observations'
>;

export type UpdateBooking = Partial<CreateBooking>;