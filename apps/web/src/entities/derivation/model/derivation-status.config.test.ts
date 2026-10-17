import { describe, it, expect } from 'vitest';
import { DerivationStatus } from '@repo/types';
import { derivationStatusConfig } from './derivation-status.config';

describe('derivationStatusConfig', () => {
  it('ne propose plus le statut « Incorrect »', () => {
    const labels = Object.values(derivationStatusConfig).map(
      (config) => config.text
    );

    expect(Object.keys(derivationStatusConfig)).not.toContain('Incorrect');
    expect(labels).not.toContain('Incorrect');
  });

  it('libelle la correction « En attente de correction »', () => {
    expect(derivationStatusConfig[DerivationStatus.REVISING].text).toBe(
      'En attente de correction'
    );
  });

  it('couvre chaque statut du cycle de vie', () => {
    expect(Object.keys(derivationStatusConfig).sort()).toEqual(
      Object.values(DerivationStatus).sort()
    );
  });
});
