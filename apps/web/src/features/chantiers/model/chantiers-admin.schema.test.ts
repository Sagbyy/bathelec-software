import { describe, expect, it } from 'vitest';
import {
  chantierScheduleSchema,
  createChantierSchema,
  createMarketSchema,
  toScheduleDto,
} from './chantiers-admin.schema';

describe('chantiers admin schemas', () => {
  it('validates market creation data', () => {
    expect(
      createMarketSchema.safeParse({ name: 'Marché IDF 2026' }).success
    ).toBe(true);
    expect(createMarketSchema.safeParse({ name: 'A' }).success).toBe(false);
  });

  it('validates chantier creation data and coerces market id', () => {
    const result = createChantierSchema.safeParse({
      address: '12 rue de la Paix',
      enedisAffaireNumber: 'ENEDIS-001',
      internalAffaireNumber: 'INT-001',
      marketId: '3',
      startDate: '',
      endDate: '',
    });

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.marketId).toBe(3);
  });

  it('accepte un chantier programmé sur une période', () => {
    expect(
      chantierScheduleSchema.safeParse({
        startDate: '2026-11-03',
        endDate: '2026-11-07',
      }).success
    ).toBe(true);
  });

  it('refuse une date de fin antérieure au début', () => {
    const result = chantierScheduleSchema.safeParse({
      startDate: '2026-11-07',
      endDate: '2026-11-03',
    });

    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0]?.path).toEqual(['endDate']);
  });

  it('refuse une date de fin sans date de début', () => {
    const result = chantierScheduleSchema.safeParse({
      startDate: '',
      endDate: '2026-11-03',
    });

    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0]?.path).toEqual(['startDate']);
  });

  it('applique les mêmes règles de planning à la création', () => {
    expect(
      createChantierSchema.safeParse({
        address: '12 rue de la Paix',
        enedisAffaireNumber: 'ENEDIS-001',
        internalAffaireNumber: 'INT-001',
        marketId: 3,
        startDate: '2026-11-07',
        endDate: '2026-11-03',
      }).success
    ).toBe(false);
  });

  it('convertit les champs vides en null pour l’API', () => {
    expect(toScheduleDto({ startDate: '2026-11-03', endDate: '' })).toEqual({
      startDate: '2026-11-03',
      endDate: null,
    });
  });
});
