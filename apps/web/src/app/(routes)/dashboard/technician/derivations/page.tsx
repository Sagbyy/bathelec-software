'use client';

import { useOngoingChantiers } from '@/entities/chantier';
import { MarketGrid } from '@/features/chantiers';

export default function ChantiersEnCoursPage() {
  const { data: chantiers, isLoading, error } = useOngoingChantiers();

  if (isLoading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8">Une erreur est survenue</div>;

  return (
    <div className="mx-2 py-10 sm:mx-10">
      <h1 className="mb-6 text-2xl font-bold">Chantiers en cours</h1>
      <MarketGrid
        chantiers={chantiers ?? []}
        basePath="/dashboard/technician/derivations"
        emptyMessage="Aucun marché avec chantier en cours."
      />
    </div>
  );
}
