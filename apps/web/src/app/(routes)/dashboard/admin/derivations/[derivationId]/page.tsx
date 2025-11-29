'use client';

import CorrectionComment from '@/components/derivations/admin/correction-comment';
import { InfoCard } from '@/components/derivations/info-derivation-card';
import { MultiStepForm } from '@/components/derivations/multi-step-form';
import { Button } from '@/components/ui/button';
import { useDerivationById } from '@/hooks/queries/use-derivation';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDerivationStatusStore } from '@/hooks/use-derivation-status.store';

export default function AdminDerivationPage() {
  const { derivationId } = useParams();
  const router = useRouter();
  const { setIsNotEditable } = useDerivationStatusStore();

  const {
    data: derivation,
    isLoading,
    error,
  } = useDerivationById(parseInt(derivationId as string));

  useEffect(() => {
    setIsNotEditable(true);
    return () => {
      setIsNotEditable(false);
    };
  }, [setIsNotEditable]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!derivation) return <div>Derivation not found</div>;

  return (
    <div className="container relative mx-auto max-w-3xl space-y-8 px-4 py-10 md:px-6">
      <Button variant="secondary" size="sm" onClick={() => router.back()}>
        <Icon icon="mdi:arrow-left" />
        <p>Retour</p>
      </Button>
      <h1 className="text-center text-3xl font-bold">
        Formulaire d'Intervention
      </h1>
      <CorrectionComment derivationStatus={derivation?.status} />
      <InfoCard
        status={derivation?.status}
        city={derivation?.city}
        postalCode={derivation?.postalCode}
        address={derivation?.address}
        createdAt={derivation?.createdAt}
      />
      <MultiStepForm derivation={derivation} readOnly={true} />
    </div>
  );
}
