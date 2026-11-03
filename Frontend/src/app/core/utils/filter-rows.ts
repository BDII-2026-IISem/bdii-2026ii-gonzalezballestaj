export function filterRows<T>(
  rows: T[],
  searchTerm: string,
  fields?: (keyof T)[]
): T[] {
  const term = searchTerm.trim().toLowerCase();

  if (!term) {
    return rows;
  }

  return rows.filter((row) => {
    const values = fields
      ? fields.map((field) => row[field])
      : Object.values(row as Record<string, unknown>);

    return values.some((value) =>
      String(value ?? '').toLowerCase().includes(term)
    );
  });
}