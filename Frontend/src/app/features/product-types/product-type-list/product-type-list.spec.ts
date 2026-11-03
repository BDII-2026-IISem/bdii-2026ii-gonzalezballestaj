import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ConfirmationService } from 'primeng/api';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { ProductTypeList } from './product-type-list';
import { ProductTypeApi } from '../../../core/services/product-type-api';
import { NotificationService } from '../../../core/services/notification.service';
import { ProductType } from '../../../core/models/product-type.model';

describe('ProductTypeList', () => {
  let component: ProductTypeList;
  let api: any;
  let notification: any;

  let confirmationOptions:
    | { accept?: () => void }
    | undefined;

  const mockProductType: ProductType = {
    id: 12,
    name: 'Ambiente',
    description: 'Tipo de producto de prueba',
    status: 'active',
    createdAt: '2026-11-03T10:00:00Z',
    updatedAt: '2026-11-03T10:00:00Z'
  };

  beforeEach(async () => {
    api = {
      list: vi.fn().mockReturnValue(of([mockProductType])),
      getById: vi.fn(),
      create: vi.fn().mockReturnValue(of(mockProductType)),
      update: vi.fn().mockReturnValue(of(mockProductType)),
      remove: vi.fn().mockReturnValue(of(void 0))
    };

    notification = {
      success: vi.fn(),
      error: vi.fn()
    };

    const confirmation = {
      confirm: vi.fn((options: { accept?: () => void }) => {
        confirmationOptions = options;
      })
    } as unknown as ConfirmationService;

    await TestBed.configureTestingModule({
      imports: [ProductTypeList],
      providers: [
        provideNoopAnimations(),
        { provide: ProductTypeApi, useValue: api },
        { provide: NotificationService, useValue: notification },
        { provide: ConfirmationService, useValue: confirmation }
      ]
    }).compileComponents();

    confirmationOptions = undefined;

    const fixture = TestBed.createComponent(ProductTypeList);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar los tipos de producto activos', () => {
    expect(api.list).toHaveBeenCalledWith('active');
    expect(component.rows()).toEqual([mockProductType]);
  });

  it('debe filtrar los tipos por nombre', () => {
    component.filter.set('Ambiente');

    expect(component.visibleRows().length).toBe(1);

    component.filter.set('Inexistente');

    expect(component.visibleRows().length).toBe(0);
  });

  it('debe registrar un tipo de producto con estado activo', () => {
    const payload = {
      name: 'Ambiente nuevo',
      description: 'Descripción de prueba'
    };

    component.save(payload);

    expect(api.create).toHaveBeenCalledWith({
      ...payload,
      status: 'active'
    });

    expect(notification.success).toHaveBeenCalled();
  });

  it('debe solicitar confirmación antes de desactivar un tipo', () => {
    component.confirmDeactivate(mockProductType);

    expect(confirmationOptions).toBeTruthy();

    confirmationOptions?.accept?.();

    expect(api.remove).toHaveBeenCalledWith(12);
    expect(component.rows()).toEqual([]);
    expect(notification.success).toHaveBeenCalled();
  });
});