import { describe, expect, it } from 'vitest';
import { formatChantierSchedule, toDateInputValue } from './chantier-schedule';

describe('formatChantierSchedule', () => {
  it('signale un chantier sans date', () => {
    expect(formatChantierSchedule({ startDate: null, endDate: null })).toBe(
      'Non programmé'
    );
  });

  it('affiche un jour unique sans date de fin', () => {
    expect(
      formatChantierSchedule({ startDate: '2026-11-03T00:00:00.000Z' })
    ).toBe('Le 3 novembre 2026');
  });

  it('affiche un jour unique quand début et fin coïncident', () => {
    expect(
      formatChantierSchedule({
        startDate: '2026-11-03T00:00:00.000Z',
        endDate: '2026-11-03T00:00:00.000Z',
      })
    ).toBe('Le 3 novembre 2026');
  });

  it('affiche la période complète', () => {
    expect(
      formatChantierSchedule({
        startDate: '2026-11-03T00:00:00.000Z',
        endDate: '2026-11-07T00:00:00.000Z',
      })
    ).toBe('Du 3 novembre 2026 au 7 novembre 2026');
  });
});

describe('toDateInputValue', () => {
  it('convertit une date ISO pour un champ date', () => {
    expect(toDateInputValue('2026-11-03T00:00:00.000Z')).toBe('2026-11-03');
  });

  it('retourne une chaîne vide sans date', () => {
    expect(toDateInputValue(null)).toBe('');
    expect(toDateInputValue(undefined)).toBe('');
  });
});
