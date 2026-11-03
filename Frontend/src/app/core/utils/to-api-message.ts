export function toApiMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error !== 'object' || error === null) {
    return 'Ha ocurrido un error inesperado.';
  }

  const data = error as Record<string, unknown>;

  if (typeof data['detail'] === 'string') {
    return data['detail'];
  }

  if (typeof data['message'] === 'string') {
    return data['message'];
  }

  const messages = Object.values(data)
    .flatMap((value) => {
      if (typeof value === 'string') {
        return [value];
      }

      if (Array.isArray(value)) {
        return value.filter(
          (item): item is string => typeof item === 'string'
        );
      }

      return [];
    });

  return messages.length > 0
    ? messages.join(' ')
    : 'Ha ocurrido un error inesperado.';
}