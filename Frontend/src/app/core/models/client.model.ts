export type RecordStatus = 'active' | 'inactive';

export interface Client {
  id: number;
  documentType: string;
  documentNumber: string;
  name: string;
  phone: string | null;
  email: string | null;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateClient = Omit<
  Client,
  'id' | 'status' | 'createdAt' | 'updatedAt'
>;

export type UpdateClient = Partial<CreateClient>;