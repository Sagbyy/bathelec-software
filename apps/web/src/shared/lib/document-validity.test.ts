import { describe, expect, it } from 'vitest';
import {
  formatValidityDate,
  getValidityStatus,
  toDateInputValue,
} from './document-validity';

const today = new Date(2026, 9, 17);

describe('getValidityStatus', () => {
  it('signale une date manquante', () => {
    expect(getValidityStatus(null, today)).toBe('missing');
    expect(getValidityStatus(undefined, today)).toBe('missing');
  });

  it('signale un document expiré', () => {
    expect(getValidityStatus('2026-10-16T00:00:00.000Z', today)).toBe(
      'expired'
    );
  });

  it("considère un document valide jusqu'au dernier jour inclus", () => {
    expect(getValidityStatus('2026-10-17', today)).toBe('expiring');
  });

  it('signale un document expirant dans les 60 jours', () => {
    expect(getValidityStatus('2026-12-16', today)).toBe('expiring');
  });

  it('considère valide un document expirant au-delà de 60 jours', () => {
    expect(getValidityStatus('2026-12-17', today)).toBe('valid');
  });
});

describe('formatValidityDate', () => {
  it('formate la date en français sans décalage de fuseau', () => {
    expect(formatValidityDate('2027-05-31T00:00:00.000Z')).toBe('31 mai 2027');
  });
});

describe('toDateInputValue', () => {
  it('prépare une date pour un champ date', () => {
    expect(toDateInputValue('2027-05-31T00:00:00.000Z')).toBe('2027-05-31');
    expect(toDateInputValue(null)).toBe('');
  });
});
