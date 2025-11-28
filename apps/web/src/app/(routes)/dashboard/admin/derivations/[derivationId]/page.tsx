'use client';

import { InfoCard } from '@/components/derivations/info-derivation-card';
import { MultiStepForm } from '@/components/derivations/multi-step-form';
import { Button } from '@/components/ui/button';
import { useDerivationById } from '@/hooks/queries/use-derivation';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useParams, useRouter } from 'next/navigation';

export default function AdminDerivationPage() {
  const { derivationId } = useParams();
  const router = useRouter();

  const {
    data: derivation,
    isLoading,
    error,
  } = useDerivationById(parseInt(derivationId as string));

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!derivation) return <div>Derivation not found</div>;

  return (
    <div className="container relative mx-auto max-w-3xl px-4 py-10 md:px-6">
      <Button variant="secondary" size="sm" onClick={() => router.back()}>
        <Icon icon="mdi:arrow-left" />
        <p>Retour</p>
      </Button>
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
      <MultiStepForm derivation={derivation} />
    </div>
  );
}
