import { StructuredField } from '../models/procurement-structured-response.model';

export function formatIsoDate(value?: string | null): string {
  if (!value?.trim()) {
    return '—';
  }

  const trimmed = value.trim();
  const isoDateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (isoDateMatch) {
    const year = Number(isoDateMatch[1]);
    const month = Number(isoDateMatch[2]);
    const day = Number(isoDateMatch[3]);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      });
    }
  }

  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  return trimmed;
}

export function formatStructuredAmount(
  value: string | number | null | undefined,
  currencyCode?: string
): string {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  const numericValue = Number(value);
  if (isNaN(numericValue)) {
    return String(value);
  }

  const formattedAmount = numericValue.toFixed(2);
  const code = currencyCode?.trim();
  return code ? `${code} ${formattedAmount}` : formattedAmount;
}

export function formatUserFriendlyStatus(value?: string | null): string {
  if (!value?.trim()) {
    return '—';
  }

  return value
    .trim()
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, character => character.toUpperCase());
}

export function getStatusBadgeClass(status: string | number | null | undefined): string {
  const normalized = String(status ?? '').trim().toUpperCase();

  if (['APPROVED', 'ACTIVE', 'RECEIVED', 'COMPLETED', 'SUCCESS', 'PAID'].includes(normalized)) {
    return 'badge badge-success';
  }

  if (['PENDING', 'IN_PROGRESS', 'DRAFT', 'SUBMITTED', 'PROCESSING'].includes(normalized)) {
    return 'badge badge-warning';
  }

  if (['REJECTED', 'EXPIRED', 'CANCELLED', 'CANCELED', 'FAILED', 'DENIED', 'INACTIVE'].includes(normalized)) {
    return 'badge badge-danger';
  }

  return 'badge badge-primary';
}

export function formatStructuredField(field: StructuredField): string {
  switch (field.type) {
    case 'date':
      return formatIsoDate(typeof field.value === 'string' ? field.value : String(field.value ?? ''));
    case 'amount':
      return formatStructuredAmount(field.value, field.currencyCode);
    case 'status':
      return field.value === null || field.value === undefined || field.value === ''
        ? '—'
        : String(field.value).trim();
    default:
      return field.value === null || field.value === undefined || field.value === ''
        ? '—'
        : String(field.value).trim();
  }
}
