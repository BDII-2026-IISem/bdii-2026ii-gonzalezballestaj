export const LOW_CAPACITY_THRESHOLD = 3;

type WithStatus = { status: string };

/** Interpreta "2026-11-03" como fecha local, no como medianoche UTC. */
export function toLocalDate(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (match) {
    const [, y, m, d] = match;
    return new Date(Number(y), Number(m) - 1, Number(d));
  }
  return new Date(value);
}

export function sameDay(value: string | null | undefined, reference: Date): boolean {
  if (!value) {
    return false;
  }
  const date = toLocalDate(value);
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth() &&
    date.getDate() === reference.getDate()
  );
}

export function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export interface DashboardStats<D> {
  todayBookings: number;
  totalBookings: number;
  todayIncome: number;
  lowCapacity: D[];
  activeClients: number;
}

export function computeDashboardStats<D extends WithStatus & { availableCapacity: number }>(
  bookings: (WithStatus & { createdAt: string })[],
  payments: (WithStatus & { paymentDate: string; amount: string | number })[],
  departures: D[],
  clients: WithStatus[],
  today: Date = new Date()
): DashboardStats<D> {
  return {
    todayBookings: bookings.filter(
      (b) => b.status === 'active' && sameDay(b.createdAt, today)
    ).length,
    totalBookings: bookings.length,
    todayIncome: payments
      .filter((p) => p.status === 'active' && sameDay(p.paymentDate, today))
      .reduce((sum, p) => sum + toNumber(p.amount), 0),
    lowCapacity: departures.filter(
      (d) => d.status === 'active' && d.availableCapacity <= LOW_CAPACITY_THRESHOLD
    ),
    activeClients: clients.filter((c) => c.status === 'active').length,
  };
}
