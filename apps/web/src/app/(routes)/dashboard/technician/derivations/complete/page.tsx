'use client';

import { useFinishedChantiers } from '@/entities/chantier';
import { MarketGrid } from '@/features/chantiers';

export default function ChantiersTerminesPage() {
  const { data: chantiers, isLoading, error } = useFinishedChantiers();

  if (isLoading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8">Une erreur est survenue</div>;

  return (
    <div className="mx-2 py-10 sm:mx-10">
      <h1 className="mb-6 text-2xl font-bold">Chantiers terminés</h1>
      <MarketGrid
        chantiers={chantiers ?? []}
        basePath="/dashboard/technician/derivations/complete"
        emptyMessage="Aucun marché avec chantier terminé."
      />
    </div>
  );
}
