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


/** Reserva hecha por un cliente: el backend usa su ficha y crea el viajero. */
export interface SelfBookingRequest {
  departure: number;
  startDate: string;
  endDate: string;
  travelerName: string;
  observations: string | null;
  payments: {
    referenceType: string;
    method: string;
    amount: number;
    paymentDate: string;
  }[];
}
