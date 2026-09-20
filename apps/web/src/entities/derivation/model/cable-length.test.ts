import { describe, it, expect } from 'vitest';
import { isCableLengthValidForSection } from './cable-length';

describe('isCableLengthValidForSection (RG-08)', () => {
  describe('2x16 (0 to 10 m)', () => {
    it.each([0, 5, 10])('accepts %d m', (length) => {
      expect(isCableLengthValidForSection(length, '2x16')).toBe(true);
    });

    it('rejects a length above 10 m', () => {
      expect(isCableLengthValidForSection(11, '2x16')).toBe(false);
      expect(isCableLengthValidForSection(25, '2x16')).toBe(false);
    });
  });

  describe('2x25 (11 to 20 m)', () => {
    it.each([11, 15, 20])('accepts %d m', (length) => {
      expect(isCableLengthValidForSection(length, '2x25')).toBe(true);
    });

    it('rejects a length below 11 m', () => {
      expect(isCableLengthValidForSection(10, '2x25')).toBe(false);
      expect(isCableLengthValidForSection(0, '2x25')).toBe(false);
    });

    it('rejects a length above 20 m', () => {
      expect(isCableLengthValidForSection(21, '2x25')).toBe(false);
    });
  });

  describe('2x35 (21 m and above)', () => {
    it.each([21, 50, 1000])('accepts %d m', (length) => {
      expect(isCableLengthValidForSection(length, '2x35')).toBe(true);
    });

    it('rejects a length below 21 m', () => {
      expect(isCableLengthValidForSection(20, '2x35')).toBe(false);
      expect(isCableLengthValidForSection(0, '2x35')).toBe(false);
    });
  });

  describe('non-integer lengths stay covered (no coherence gap)', () => {
    it('assigns 10.5 m to 2x25, not 2x16', () => {
      expect(isCableLengthValidForSection(10.5, '2x16')).toBe(false);
      expect(isCableLengthValidForSection(10.5, '2x25')).toBe(true);
    });

    it('assigns 20.5 m to 2x35, not 2x25', () => {
      expect(isCableLengthValidForSection(20.5, '2x25')).toBe(false);
      expect(isCableLengthValidForSection(20.5, '2x35')).toBe(true);
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
