'use client';

import { useQuery } from '@tanstack/react-query';
import { CheckCheck, Undo2 } from 'lucide-react';
import { derivationQueries } from '@/entities/derivation';
import { Skeleton } from '@/shared/ui/skeleton';
import { StatCard } from '@/shared/ui/stat-card';

const formatRate = (rate: number | null) =>
  rate === null ? '—' : `${rate.toLocaleString('fr-FR')} %`;

export function ReviewStatsCards() {
  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery(derivationQueries.reviewStats());

  if (isLoading) {
    return (
      <div
        className="grid gap-3 sm:gap-4 md:grid-cols-2"
        aria-label="Chargement des statistiques de revue..."
      >
        <Skeleton className="h-[136px] rounded-xl" />
        <Skeleton className="h-[136px] rounded-xl" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <p className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
        Impossible de charger les statistiques de revue.
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
      <StatCard
        label="Validées du premier coup"
        value={formatRate(stats.firstTimeValidationRate)}
        tone="success"
        icon={<CheckCheck />}
        hint={`${stats.firstTimeValidatedCount} sur ${stats.completedCount} dérivation(s) terminée(s) sans renvoi en correction`}
      />
      <StatCard
        label="Taux de retour"
        value={formatRate(stats.returnRate)}
        tone="brand"
        icon={<Undo2 />}
        hint={`${stats.returnedCount} sur ${stats.reviewedCount} dérivation(s) revue(s) renvoyée(s) au moins une fois · ${stats.totalReturns} renvoi(s) au total`}
      />
    </div>
  );
}
