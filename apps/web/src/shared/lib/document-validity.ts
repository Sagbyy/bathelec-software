import { differenceInCalendarDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const EXPIRING_SOON_DAYS = 60;

export type ValidityStatus = 'missing' | 'expired' | 'expiring' | 'valid';

export const toCalendarDate = (value: string) => {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return new Date(year!, month! - 1, day!);
};

export const toDateInputValue = (value?: string | null) =>
  value ? value.slice(0, 10) : '';

export const getValidityStatus = (
  expiresAt: string | null | undefined,
  today: Date = new Date()
): ValidityStatus => {
  if (!expiresAt) return 'missing';
  const remainingDays = differenceInCalendarDays(
    toCalendarDate(expiresAt),
    today
  );
  if (remainingDays < 0) return 'expired';
  if (remainingDays <= EXPIRING_SOON_DAYS) return 'expiring';
  return 'valid';
};

export const formatValidityDate = (expiresAt: string) =>
  format(toCalendarDate(expiresAt), 'd MMMM yyyy', { locale: fr });
