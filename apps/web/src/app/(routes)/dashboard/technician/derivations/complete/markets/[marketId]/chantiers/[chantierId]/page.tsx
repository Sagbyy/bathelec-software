'use client';

import { useParams } from 'next/navigation';
import { useFinishedChantiers } from '@/entities/chantier';
import { ChantierDerivationsView } from '@/features/chantiers';

export default function FinishedChantierDerivationsPage() {
  const { chantierId } = useParams();
  const { data: chantiers, isLoading, error } = useFinishedChantiers();

  return (
    <ChantierDerivationsView
      chantiers={chantiers ?? []}
      chantierId={parseInt(chantierId as string)}
      isLoading={isLoading}
      error={error}
    />
  );
}
