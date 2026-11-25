import { describe, expect, it } from 'vitest';
import {
  BASE_RETRY_DELAY_MS,
  computeRetryDelay,
  MAX_RETRY_DELAY_MS,
} from './backoff';

describe('computeRetryDelay', () => {
  it('starts at the base delay', () => {
    expect(computeRetryDelay(1)).toBe(BASE_RETRY_DELAY_MS);
    expect(computeRetryDelay(0)).toBe(BASE_RETRY_DELAY_MS);
  });

  it('doubles after each failed attempt', () => {
    expect(computeRetryDelay(2)).toBe(2 * BASE_RETRY_DELAY_MS);
    expect(computeRetryDelay(3)).toBe(4 * BASE_RETRY_DELAY_MS);
  });

  it('is capped', () => {
    expect(computeRetryDelay(50)).toBe(MAX_RETRY_DELAY_MS);
  });
});
