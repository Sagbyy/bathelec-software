import { describe, expect, it } from 'vitest';
import { getDerivationReference } from './derivation-reference';

describe('getDerivationReference', () => {
  it('utilise le folio comme identifiant de la dérivation', () => {
    expect(
      getDerivationReference({
        id: 12,
        folio: 'SGX001 - COM001 - ASC001 - 001 - 101',
      })
    ).toBe('SGX001 - COM001 - ASC001 - 001 - 101');
  });

  it("se rabat sur le numéro tant que le folio n'est pas saisi", () => {
    expect(getDerivationReference({ id: 12, folio: null })).toBe(
      'Dérivation n°12'
    );
    expect(getDerivationReference({ id: 12 })).toBe('Dérivation n°12');
  });
});
