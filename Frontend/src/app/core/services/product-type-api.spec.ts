import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { ProductTypeApi } from './product-type-api';
import {
  ProductType,
  ProductTypePayload
} from '../models/product-type.model';

describe('ProductTypeApi', () => {
  let api: ProductTypeApi;
  let httpMock: HttpTestingController;

  const baseUrl = `${environment.apiUrl}/product-types`;

  const mockProductType: ProductType = {
    id: 12,
    name: 'Ambiente',
    description: 'Tipo de producto de prueba',
    status: 'active',
    createdAt: '2026-11-03T10:00:00Z',
    updatedAt: '2026-11-03T10:00:00Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductTypeApi,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    api = TestBed.inject(ProductTypeApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe consultar los tipos de producto activos', () => {
    api.list('active').subscribe((types) => {
      expect(types.length).toBe(1);
      expect(types[0].name).toBe('Ambiente');
    });

    const request = httpMock.expectOne(
      `${baseUrl}/?status=active`
    );

    expect(request.request.method).toBe('GET');

    request.flush([mockProductType]);
  });

  it('debe consultar un tipo de producto por ID', () => {
    api.getById(12).subscribe((type) => {
      expect(type.id).toBe(12);
    });

    const request = httpMock.expectOne(`${baseUrl}/12/`);

    expect(request.request.method).toBe('GET');

    request.flush(mockProductType);
  });

  it('debe registrar un tipo de producto', () => {
    const payload = {
      name: 'Ambiente',
      description: 'Tipo de producto de prueba',
      status: 'active' as const
    };

    api.create(payload).subscribe((type) => {
      expect(type.name).toBe('Ambiente');
    });

    const request = httpMock.expectOne(`${baseUrl}/`);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);

    request.flush(mockProductType);
  });

  it('debe actualizar un tipo de producto', () => {
    const payload: ProductTypePayload = {
      name: 'Ambiente actualizado',
      description: 'Descripción actualizada'
    };

    api.update(12, payload).subscribe((type) => {
      expect(type.name).toBe('Ambiente actualizado');
    });

    const request = httpMock.expectOne(`${baseUrl}/12/`);

    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual(payload);
    expect(request.request.body.status).toBeUndefined();

    request.flush({
      ...mockProductType,
      ...payload
    });
  });

  it('debe desactivar un tipo de producto', () => {
    api.remove(12).subscribe();

    const request = httpMock.expectOne(`${baseUrl}/12/`);

    expect(request.request.method).toBe('DELETE');

    request.flush(null);
  });
});
