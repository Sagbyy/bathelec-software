'use client';

import { useParams } from 'next/navigation';
import { useOngoingChantiers } from '@/entities/chantier';
import { MarketChantiersView } from '@/features/chantiers';

export default function OngoingMarketChantiersPage() {
  const { marketId } = useParams();
  const { data: chantiers, isLoading, error } = useOngoingChantiers();

  return (
    <MarketChantiersView
      chantiers={chantiers ?? []}
      marketId={parseInt(marketId as string)}
      basePath="/dashboard/technician/derivations"
      isLoading={isLoading}
      error={error}
    />
  );
}
