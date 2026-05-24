import { describe, expect, it } from 'vitest';
import {
  createChantierSchema,
  createMarketSchema,
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
    });

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.marketId).toBe(3);
  });
});
