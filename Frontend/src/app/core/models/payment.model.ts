import type { RecordStatus } from './client.model';

export interface Payment {
  id: number;
  booking: number;
  referenceType: string;
  method: string;
  amount: string;
  paymentDate: string;
  status: RecordStatus;
}

export interface CreateBookingPayment {
  referenceType: string;
  method: string;
  amount: number;
  paymentDate: string;
}

export type CreatePayment = Omit<
  Payment,
  'id' | 'status'
>;

export type UpdatePayment = Partial<
  Omit<Payment, 'id' | 'status' | 'booking'>
>;