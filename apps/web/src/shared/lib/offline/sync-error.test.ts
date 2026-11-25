import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';
import {
  classifySyncError,
  DEFAULT_REJECTION_MESSAGE,
  getSyncErrorMessage,
} from './sync-error';

const httpError = (status: number, message?: unknown) =>
  new AxiosError('Request failed', 'ERR_BAD_RESPONSE', undefined, undefined, {
    status,
    statusText: '',
    data: { message },
    headers: {},
    config: { headers: new AxiosHeaders() },
  });

describe('classifySyncError', () => {
  it('retries when no response came back', () => {
    expect(classifySyncError(new AxiosError('Network Error'))).toBe('retry');
    expect(classifySyncError(new TypeError('Failed to fetch'))).toBe('retry');
  });

  it.each([500, 502, 503, 408, 425, 429])('retries on HTTP %i', (status) => {
    expect(classifySyncError(httpError(status))).toBe('retry');
  });

  it('flags an expired session separately', () => {
    expect(classifySyncError(httpError(401))).toBe('auth');
  });

  it.each([400, 403, 404, 409, 413, 422])(
    'treats HTTP %i as a definitive rejection',
    (status) => {
      expect(classifySyncError(httpError(status))).toBe('rejected');
    }
  );
});

describe('getSyncErrorMessage', () => {
  it('returns the server message', () => {
    expect(getSyncErrorMessage(httpError(409, 'Folio déjà utilisé'))).toBe(
      'Folio déjà utilisé'
    );
  });

  it('joins validation messages', () => {
    expect(getSyncErrorMessage(httpError(400, ['a invalide', 'b requis']))).toBe(
      'a invalide b requis'
    );
  });

  it('falls back to a generic message', () => {
    expect(getSyncErrorMessage(httpError(400))).toBe(DEFAULT_REJECTION_MESSAGE);
    expect(getSyncErrorMessage(new Error('boom'))).toBe(
      DEFAULT_REJECTION_MESSAGE
    );
  });
});
