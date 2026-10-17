import { describe, it, expect } from 'vitest';
import { createDerivationSchema } from './create-derivation.schema';

describe('createDerivationSchema', () => {
  it('accepts a derivation assigned to a team only', () => {
    expect(
      createDerivationSchema.safeParse({ teamId: 1, chantierId: 2 }).success
    ).toBe(true);
  });

  it('accepts a derivation assigned to a team and a technician', () => {
    expect(
      createDerivationSchema.safeParse({ teamId: 1, userId: 3, chantierId: 2 })
        .success
    ).toBe(true);
  });

  it('rejects a derivation without team', () => {
    const result = createDerivationSchema.safeParse({ chantierId: 2 });

    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.teamId).toEqual([
      'Veuillez sélectionner une équipe chantier',
    ]);
  });

  it('rejects a derivation without chantier', () => {
    const result = createDerivationSchema.safeParse({ teamId: 1 });

    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.chantierId).toEqual([
      'Veuillez sélectionner un chantier',
    ]);
  });
});
