import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App - WayuuTravel', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display the header component', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-header')).toBeTruthy();
  });

  it('should display the WayuuTravel title in the header', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('WayuuTravel');
  });

  it('should display the aside component', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-aside')).toBeTruthy();
  });

  it('should display the main content', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const main = fixture.nativeElement.querySelector('main');

    expect(main).toBeTruthy();
    expect(main.textContent).toContain('Inicio');
    expect(main.textContent).toContain('Bienvenido a WayuuTravel.');
  });

  it('should display the footer component', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const footer = fixture.nativeElement.querySelector('app-footer');

    expect(footer).toBeTruthy();
    expect(footer.textContent).toContain(
      'Experiencias Turísticas Responsables',
    );
  });
});