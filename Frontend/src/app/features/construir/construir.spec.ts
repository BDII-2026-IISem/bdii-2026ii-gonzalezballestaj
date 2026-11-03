
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

  it('should display Inicio as the page title', () => {
    const fixture = TestBed.createComponent(Construir);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Inicio');
  });

  it('should display the WayuuTravel welcome message', () => {
    const fixture = TestBed.createComponent(Construir);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Bienvenido a WayuuTravel'
    );
  });

  it('should display the local data information', () => {
    const fixture = TestBed.createComponent(Construir);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Esta pantalla utiliza datos locales'
    );
  });
});
