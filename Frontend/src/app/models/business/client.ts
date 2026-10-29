// Campos del ClientSerializer de Django. La API responde en camelCase
// (djangorestframework-camel-case), por eso document_type llega como documentType.
export type ClientStatus = "active" | "inactive";

export interface ClientI {
  id?: number;
  documentType: string;
  documentNumber: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  status: ClientStatus;
}


export interface ClientResponseI {
  id?: number;
  documentType: string;
  documentNumber: string;
  name: string;
  phone: string | null;
  email: string | null;
  status: ClientStatus;
  createdAt?: string;
  updatedAt?: string;
}
