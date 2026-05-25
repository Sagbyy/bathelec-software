'use client';

import { useDerivationById } from '@/features/derivations/model/use-derivation';
import { useParams } from 'next/navigation';
import { MultiStepForm } from '@/features/derivations/ui/multi-step-form';
import { InfoCard } from '@/features/derivations/ui/info-derivation-card';
import { PageLoader } from '@/shared/ui/page-loader';

export default function CompleteDerivationPage() {
  const { derivationId } = useParams();

  const {
    data: derivation,
    isLoading,
    error,
  } = useDerivationById(parseInt(derivationId as string));

  if (isLoading) return <PageLoader />;
  if (error) return <div>Error: {error.message}</div>;
  if (!derivation) return <div>Derivation not found</div>;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10 md:px-6">
      <h1 className="mb-8 text-center text-3xl font-bold">
        Formulaire d'Intervention
      </h1>
      <InfoCard
        status={derivation?.status}
        chantier={derivation?.chantier}
        createdAt={derivation?.createdAt}
      />
      <MultiStepForm derivation={derivation} />
    </div>
  );
}
