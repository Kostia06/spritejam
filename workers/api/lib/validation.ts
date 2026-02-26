export function validateRequired(
  data: Record<string, unknown>,
  fields: string[],
): string | null {
  for (const field of fields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      return `Missing required field: ${field}`;
    }
  }
  return null;
}

export function validatePositiveInt(value: unknown): boolean {
  if (typeof value !== 'number') return false;
  return Number.isInteger(value) && value > 0;
}

export function validateHexColor(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}
