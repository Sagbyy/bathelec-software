export const EXPIRY_THRESHOLDS = [15, 30, 60] as const;

export type ExpiryThreshold = (typeof EXPIRY_THRESHOLDS)[number];

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const utcDay = (date: Date) =>
  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

export const daysUntil = (expiresAt: Date, today: Date) =>
  Math.round((utcDay(expiresAt) - utcDay(today)) / MS_PER_DAY);

export const reachedThreshold = (
  expiresAt: Date,
  today: Date
): ExpiryThreshold | null => {
  const remainingDays = daysUntil(expiresAt, today);
  if (remainingDays < 0) return null;
  return (
    EXPIRY_THRESHOLDS.find((threshold) => remainingDays <= threshold) ?? null
  );
};
