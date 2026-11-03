
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Construir } from './construir';

describe('Construir - WayuuTravel', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Construir],
      providers: [provideNoopAnimations()],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Construir);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display Inicio as the initial title', () => {
    const fixture = TestBed.createComponent(Construir);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Inicio');
  });

  it('should define five menu options', () => {
    const fixture = TestBed.createComponent(Construir);

    expect(fixture.componentInstance.items.length).toBe(5);
  });

  it('should contain the correct menu options', () => {
    const fixture = TestBed.createComponent(Construir);

    const labels = fixture.componentInstance.items.map(
      (item) => item.label,
    );

    expect(labels).toEqual([
      'Inicio',
      'Paquetes',
      'Salidas',
      'Reservas',
      'Proveedores',
    ]);
  });

  it('should update the title when selecting an option', () => {
    const fixture = TestBed.createComponent(Construir);
    const component = fixture.componentInstance;
    const item = component.items.find(
      (option) => option.label === 'Reservas',
    );

    item?.command?.({
      originalEvent: new Event('click'),
      item,
    });

    expect(component.title()).toBe('Reservas');
  });

  it('should close the mobile menu after selecting an option', () => {
    const fixture = TestBed.createComponent(Construir);
    const component = fixture.componentInstance;
    const item = component.items.find(
      (option) => option.label === 'Paquetes',
    );

    component.mobileOpen.set(true);

    item?.command?.({
      originalEvent: new Event('click'),
      item,
    });

    expect(component.mobileOpen()).toBe(false);
  });
});
