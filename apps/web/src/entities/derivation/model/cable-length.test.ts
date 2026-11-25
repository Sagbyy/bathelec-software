import { describe, it, expect } from 'vitest';
import { isCableLengthValidForSection } from './cable-length';

describe('isCableLengthValidForSection (RG-08)', () => {
  describe('2x16: alert above 10 m', () => {
    it.each([0, 5, 10])('accepts %d m', (length) => {
      expect(isCableLengthValidForSection(length, '2x16')).toBe(true);
    });

    it.each([10.5, 11, 25])('raises an alert for %d m', (length) => {
      expect(isCableLengthValidForSection(length, '2x16')).toBe(false);
    });
  });

  describe.each(['2x25', '2x35'])('%s: alert above 20 m', (section) => {
    it.each([0, 5, 15, 20])('accepts %d m', (length) => {
      expect(isCableLengthValidForSection(length, section)).toBe(true);
    });

    it.each([20.5, 21, 50])('raises an alert for %d m', (length) => {
      expect(isCableLengthValidForSection(length, section)).toBe(false);
    });
  });

  describe('no or unknown section', () => {
    it.each(['', '2x50', 'unknown'])(
      'does not raise an alert for %p',
      (section) => {
        expect(isCableLengthValidForSection(999, section)).toBe(true);
      }
    );
  });
});
