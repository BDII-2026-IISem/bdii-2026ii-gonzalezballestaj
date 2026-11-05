export type Status = 'active' | 'inactive';

export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';


/** Opciones de los selectores de estado: optionLabel="label" y optionValue="value". */
export const STATUS_OPTIONS: Array<{ label: string; value: Status }> = [
  { label: 'Activo', value: 'active' },
  { label: 'Inactivo', value: 'inactive' },
];
