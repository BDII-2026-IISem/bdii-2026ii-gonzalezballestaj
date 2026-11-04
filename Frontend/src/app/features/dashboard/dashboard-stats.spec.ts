import { computeDashboardStats, sameDay } from './dashboard-stats';

describe('computeDashboardStats', () => {
  const today = new Date(2026, 10, 3, 10, 0); // 3 nov 2026, hora local

  it('cuenta solo reservas activas de hoy', () => {
    const stats = computeDashboardStats(
      [
        { status: 'active', createdAt: '2026-11-03T09:00:00' },
        { status: 'inactive', createdAt: '2026-11-03T09:30:00' },
        { status: 'active', createdAt: '2026-11-02T18:00:00' },
      ],
      [], [], [], today
    );

    expect(stats.todayBookings).toBe(1);
    expect(stats.totalBookings).toBe(3);
  });

  it('suma solo pagos activos de hoy', () => {
    const stats = computeDashboardStats(
      [],
      [
        { status: 'active', paymentDate: '2026-11-03', amount: '150000.00' },
        { status: 'inactive', paymentDate: '2026-11-03', amount: '90000.00' },
        { status: 'active', paymentDate: '2026-11-02', amount: '70000.00' },
      ],
      [], [], today
    );

    expect(stats.todayIncome).toBe(150000);
  });

  it('cupos bajos ignora salidas inactivas y con cupo suficiente', () => {
    const stats = computeDashboardStats(
      [], [],
      [
        { id: 1, status: 'active', availableCapacity: 2 },
        { id: 2, status: 'active', availableCapacity: 10 },
        { id: 3, status: 'inactive', availableCapacity: 0 },
      ],
      [], today
    );

    expect(stats.lowCapacity.map((d) => d.id)).toEqual([1]);
  });

  it('cuenta solo clientes activos', () => {
    const stats = computeDashboardStats(
      [], [], [],
      [{ status: 'active' }, { status: 'active' }, { status: 'inactive' }],
      today
    );

    expect(stats.activeClients).toBe(2);
  });

  it('interpreta una fecha sin hora en hora local', () => {
    expect(sameDay('2026-11-03', today)).toBe(true);
  });
});
