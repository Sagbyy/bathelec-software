import { describe, expect, it } from 'vitest';
import { Derivation, DerivationStatus } from '@repo/types';
import { summarizeByInternalAffaire } from './affaire-stats';

const derivation = (
  id: number,
  status: DerivationStatus,
  internalAffaireNumber: string | null,
  address = '12 rue de la Paix'
) =>
  ({
    id,
    status,
    userId: null,
    chantierId: internalAffaireNumber ? id : null,
    chantier: internalAffaireNumber
      ? {
          id,
          address,
          enedisAffaireNumber: 'ENEDIS',
          internalAffaireNumber,
          marketId: 1,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        }
      : null,
    createdAt: '2026-01-01T00:00:00.000Z',
    correctionComment: null,
  }) as unknown as Derivation;

describe('summarizeByInternalAffaire', () => {
  it('regroupe les dérivations par numéro d’affaire interne', () => {
    const result = summarizeByInternalAffaire([
      derivation(1, DerivationStatus.COMPLETED, 'BA570035'),
      derivation(2, DerivationStatus.REVIEWING, 'BA570035'),
      derivation(3, DerivationStatus.REVISING, 'BA570035'),
      derivation(4, DerivationStatus.COMPLETED, 'BA570035'),
      derivation(5, DerivationStatus.PENDING, 'BA570042', '8 avenue Foch'),
    ]);

    expect(result).toEqual([
      {
        internalAffaireNumber: 'BA570035',
        address: '12 rue de la Paix',
        total: 4,
        completed: 2,
        awaitingReview: 1,
        awaitingCorrection: 1,
        completionRate: 50,
      },
      {
        internalAffaireNumber: 'BA570042',
        address: '8 avenue Foch',
        total: 1,
        completed: 0,
        awaitingReview: 0,
        awaitingCorrection: 0,
        completionRate: 0,
      },
    ]);
  });

  it('fusionne les numéros saisis avec une casse ou des espaces différents', () => {
    const result = summarizeByInternalAffaire([
      derivation(1, DerivationStatus.COMPLETED, 'ba570035'),
      derivation(2, DerivationStatus.COMPLETED, ' BA570035 '),
    ]);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      internalAffaireNumber: 'BA570035',
      total: 2,
      completionRate: 100,
    });
  });

  it('ignore les dérivations sans chantier', () => {
    expect(
      summarizeByInternalAffaire([
        derivation(1, DerivationStatus.PENDING, null),
      ])
    ).toEqual([]);
  });

  it('trie par numéro d’affaire', () => {
    const result = summarizeByInternalAffaire([
      derivation(1, DerivationStatus.PENDING, 'BA570099'),
      derivation(2, DerivationStatus.PENDING, 'BA570001'),
    ]);

    expect(result.map((stats) => stats.internalAffaireNumber)).toEqual([
      'BA570001',
      'BA570099',
    ]);
  });
});
