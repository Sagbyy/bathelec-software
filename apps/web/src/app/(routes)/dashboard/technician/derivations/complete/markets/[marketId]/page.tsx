'use client';

import { useParams } from 'next/navigation';
import { useFinishedChantiers } from '@/entities/chantier';
import { MarketChantiersView } from '@/features/chantiers';

export default function FinishedMarketChantiersPage() {
  const { marketId } = useParams();
  const { data: chantiers, isLoading, error } = useFinishedChantiers();

  return (
    <MarketChantiersView
      chantiers={chantiers ?? []}
      marketId={parseInt(marketId as string)}
      basePath="/dashboard/technician/derivations/complete"
      isLoading={isLoading}
      error={error}
    />
  );
}
