import {
  CABLE_NATURE_LABELS,
  METER_GENERATION_LABELS,
  METER_TYPE_LABELS,
  formatInterventionDate,
  toEnedisLabel,
} from './enedis-labels';

describe('toEnedisLabel', () => {
  it('maps every meter type code to its Enedis label', () => {
    expect(
      ['electromecanique', 'cbe', 'linky', 'other'].map((code) =>
        toEnedisLabel(METER_TYPE_LABELS, code)
      )
    ).toEqual([
      'Électromécanique',
      'CBE (Compteur Bleu Électronique)',
      'Linky',
      'Autre',
    ]);
  });

  it('maps Linky generations', () => {
    expect(toEnedisLabel(METER_GENERATION_LABELS, 'g2')).toBe('Linky G2');
  });

  it('maps cable natures', () => {
    expect(toEnedisLabel(CABLE_NATURE_LABELS, 'aluminium')).toBe('Aluminium');
  });

  it('ignores the case of legacy codes', () => {
    expect(toEnedisLabel(METER_TYPE_LABELS, 'Linky')).toBe('Linky');
  });

  it('keeps an unknown code as is', () => {
    expect(toEnedisLabel(CABLE_NATURE_LABELS, 'fibre')).toBe('fibre');
  });

  it('returns an empty cell for a missing code', () => {
    expect(toEnedisLabel(METER_GENERATION_LABELS, undefined)).toBe('');
    expect(toEnedisLabel(METER_GENERATION_LABELS, '')).toBe('');
  });
});

describe('formatInterventionDate', () => {
  it('formats the date and time in the Paris time zone', () => {
    expect(formatInterventionDate(new Date('2026-01-15T08:05:00.000Z'))).toBe(
      '15/01/2026 09:05'
    );
  });

  it('accepts an ISO string as stored by MongoDB lean documents', () => {
    expect(formatInterventionDate('2026-10-01T09:00:00.000Z')).toBe(
      '01/10/2026 11:00'
    );
  });

  it('returns an empty cell for a missing or invalid date', () => {
    expect(formatInterventionDate(undefined)).toBe('');
    expect(formatInterventionDate('not a date')).toBe('');
  });
});
