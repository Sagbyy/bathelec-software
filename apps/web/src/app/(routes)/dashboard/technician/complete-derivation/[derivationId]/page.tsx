'use client';

import { useDerivationById } from '@/hooks/queries/useDerivation';
import { useParams } from 'next/navigation';
import { MultiStepForm } from '@/components/derivations/multi-step-form';
import { InfoCard } from '@/components/derivations/info-derivation-card';

export default function CompleteDerivationPage() {
  const { derivationId } = useParams();

  const {
    data: derivation,
    isLoading,
    error,
  } = useDerivationById(parseInt(derivationId as string));

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!derivation) return <div>Derivation not found</div>;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 md:px-6">
      <h1 className="mb-8 text-center text-3xl font-bold">
        Formulaire d'Intervention
      </h1>
      <InfoCard
        status={derivation?.status}
        city={derivation?.city}
        postalCode={derivation?.postalCode}
        address={derivation?.address}
        createdAt={derivation?.createdAt}
      />
      <MultiStepForm requestedDerivationId={derivation.id} />
    </div>
  );
}
