'use client';

import { useParams } from 'next/navigation';
import { useOngoingChantiers } from '@/entities/chantier';
import { ChantierDerivationsView } from '@/features/chantiers';

export default function OngoingChantierDerivationsPage() {
  const { chantierId } = useParams();
  const { data: chantiers, isLoading, error } = useOngoingChantiers();

  return (
    <ChantierDerivationsView
      chantiers={chantiers ?? []}
      chantierId={parseInt(chantierId as string)}
      isLoading={isLoading}
      error={error}
    />
  );
}
