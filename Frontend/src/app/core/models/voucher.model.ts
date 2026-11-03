import type { RecordStatus } from './client.model';

export interface Voucher {
  id: number;
  booking: number;
  name: string;
  descriptions: string | null;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateVoucher = Pick<
  Voucher,
  'booking' | 'name' | 'descriptions'
>;

export type UpdateVoucher = Partial<CreateVoucher>;