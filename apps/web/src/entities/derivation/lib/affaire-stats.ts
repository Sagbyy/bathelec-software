import { Derivation, DerivationStatus } from '@repo/types';

export type AffaireStats = {
  internalAffaireNumber: string;
  address: string;
  total: number;
  completed: number;
  awaitingReview: number;
  awaitingCorrection: number;
  completionRate: number;
};

const createStats = (
  internalAffaireNumber: string,
  address: string
): AffaireStats => ({
  internalAffaireNumber,
  address,
  total: 0,
  completed: 0,
  awaitingReview: 0,
  awaitingCorrection: 0,
  completionRate: 0,
});

export const summarizeByInternalAffaire = (
  derivations: Derivation[]
): AffaireStats[] => {
  const statsByAffaire = new Map<string, AffaireStats>();

  for (const derivation of derivations) {
    const chantier = derivation.chantier;
    if (!chantier) continue;

    const key = chantier.internalAffaireNumber.trim().toUpperCase();
    const stats = statsByAffaire.get(key) ?? createStats(key, chantier.address);
    stats.total += 1;
    if (derivation.status === DerivationStatus.COMPLETED) stats.completed += 1;
    if (derivation.status === DerivationStatus.REVIEWING)
      stats.awaitingReview += 1;
    if (derivation.status === DerivationStatus.REVISING)
      stats.awaitingCorrection += 1;
    statsByAffaire.set(key, stats);
  }

  return Array.from(statsByAffaire.values())
    .map((stats) => ({
      ...stats,
      completionRate: Math.round((stats.completed / stats.total) * 100),
    }))
    .sort((a, b) =>
      a.internalAffaireNumber.localeCompare(b.internalAffaireNumber)
    );
};
