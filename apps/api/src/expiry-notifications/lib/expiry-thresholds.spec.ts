import { daysUntil, reachedThreshold } from './expiry-thresholds';

const today = new Date('2026-10-17T07:00:00.000Z');
const inDays = (days: number) =>
  new Date(Date.UTC(2026, 9, 17 + days, 0, 0, 0));

describe('expiry thresholds', () => {
  it('counts calendar days until expiry', () => {
    expect(daysUntil(inDays(60), today)).toBe(60);
    expect(daysUntil(inDays(0), today)).toBe(0);
  });

  it.each([
    [61, null],
    [60, 60],
    [31, 60],
    [30, 30],
    [16, 30],
    [15, 15],
    [0, 15],
    [-1, null],
  ])('with %i day(s) left reaches threshold %p', (days, threshold) => {
    expect(reachedThreshold(inDays(days), today)).toBe(threshold);
  });
});
