import { describe, it, expect } from 'vitest';
import { CompletedDerivation, Derivation, DerivationStatus } from '@repo/types';
import { toDerivationRow } from './derivation-row';

const derivation: Derivation = {
  id: 1,
  userId: 99,
  chantierId: 1,
  chantier: null,
  createdAt: '2026-11-01T00:00:00.000Z',
  status: DerivationStatus.REVIEWING,
  correctionComment: null,
  folio: 'SGX001 - COM001 - ASC001 - 001 - 101',
  teamId: 3,
};

describe('toDerivationRow', () => {
  it('falls back on the derivation folio when its report is not readable', () => {
    const row = toDerivationRow(derivation, undefined);

    expect(row.folio).toBe('SGX001 - COM001 - ASC001 - 001 - 101');
    expect(row.clientName).toBe('');
    expect(row.completedAt).toBeNull();
  });

  it('prefers the folio of the report', () => {
    const row = toDerivationRow(derivation, {
      clientInfo: {
        folio: 'ABC001 - COM001 - ASC001 - 001 - 102',
        name: 'DUPONT',
      },
    } as CompletedDerivation);

    expect(row.folio).toBe('ABC001 - COM001 - ASC001 - 001 - 102');
    expect(row.clientName).toBe('DUPONT');
  });

  it('leaves the folio empty when nothing is known', () => {
    expect(
      toDerivationRow({ ...derivation, folio: null }, undefined).folio
    ).toBe('');
  });
});
