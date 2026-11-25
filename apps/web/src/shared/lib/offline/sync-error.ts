import { isAxiosError } from 'axios';

export type SyncErrorKind = 'retry' | 'auth' | 'rejected';

const RETRYABLE_STATUSES = new Set([408, 425, 429]);
const SERVER_ERROR_THRESHOLD = 500;

export const DEFAULT_REJECTION_MESSAGE = 'Le serveur a refusé cet envoi.';

export const classifySyncError = (error: unknown): SyncErrorKind => {
  if (!isAxiosError(error) || !error.response) {
    return 'retry';
  }

  const { status } = error.response;
  if (status === 401) {
    return 'auth';
  }
  if (status >= SERVER_ERROR_THRESHOLD || RETRYABLE_STATUSES.has(status)) {
    return 'retry';
  }
  return 'rejected';
};

const toText = (message: unknown): string | undefined => {
  if (Array.isArray(message)) {
    return message.filter((part) => typeof part === 'string').join(' ');
  }
  return typeof message === 'string' && message.length > 0
    ? message
    : undefined;
};

export const getSyncErrorMessage = (error: unknown): string => {
  if (isAxiosError<{ message?: unknown }>(error)) {
    return toText(error.response?.data?.message) ?? DEFAULT_REJECTION_MESSAGE;
  }
  return DEFAULT_REJECTION_MESSAGE;
};
