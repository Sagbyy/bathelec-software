'use client';

import { useQuery } from '@tanstack/react-query';
import { derivationQueries } from '@/entities/derivation';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

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
      <p className="text-muted-foreground text-sm">
        Chargement des statistiques de revue...
      </p>
    );
  }

  if (isError || !stats) {
    return (
      <p className="text-destructive text-sm">
        Impossible de charger les statistiques de revue.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Validées du premier coup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatRate(stats.firstTimeValidationRate)}
          </div>
          <p className="text-muted-foreground text-xs">
            {stats.firstTimeValidatedCount} sur {stats.completedCount}{' '}
            dérivation(s) terminée(s) sans renvoi en correction
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Taux de retour</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatRate(stats.returnRate)}
          </div>
          <p className="text-muted-foreground text-xs">
            {stats.returnedCount} sur {stats.reviewedCount} dérivation(s)
            revue(s) renvoyée(s) au moins une fois · {stats.totalReturns}{' '}
            renvoi(s) au total
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
