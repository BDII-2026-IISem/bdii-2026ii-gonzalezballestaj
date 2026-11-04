import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { BookingService } from './booking.service';

describe('BookingService', () => {
  let service: BookingService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(BookingService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getById(4) hace GET a /sale/bookings/4/ y lee camelCase', () => {
    let startDate = '';
    service.getById(4).subscribe((booking) => (startDate = booking.startDate));

    const req = http.expectOne((r) => r.url.endsWith('/sale/bookings/4/'));
    expect(req.request.method).toBe('GET');

    req.flush({
      id: 4, client: 7, departure: 1, traveler: 1,
      startDate: '2026-10-22', endDate: '2026-10-23',
      observations: null, status: 'inactive',
      createdAt: '2026-10-12T18:30:17-05:00',
      updatedAt: '2026-11-03T21:05:35-05:00',
    });

    expect(startDate).toBe('2026-10-22');
  });

  it('cancel(4) hace POST a /sale/bookings/4/cancel/', () => {
    service.cancel(4, { name: 'Prueba' }).subscribe();

    const req = http.expectOne((r) => r.url.endsWith('/sale/bookings/4/cancel/'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'Prueba' });

    req.flush({ id: 1, booking: 4 });
  });
});
