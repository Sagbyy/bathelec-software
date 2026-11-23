'use client';

import { useParams } from 'next/navigation';
import { ClipboardPen } from 'lucide-react';
import { useDerivationById } from '@/features/derivations/model/use-derivation';
import { MultiStepForm } from '@/features/derivations/ui/multi-step-form';
import { InfoCard } from '@/features/derivations/ui/info-derivation-card';
import { getDerivationReference } from '@/entities/derivation';
import { PageLoader } from '@/shared/ui/page-loader';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';
import { EmptyState } from '@/shared/ui/empty-state';

export default function CompleteDerivationPage() {
  const { derivationId } = useParams();

  const {
    data: derivation,
    isLoading,
    error,
  } = useDerivationById(parseInt(derivationId as string));

  if (isLoading) return <PageLoader inline />;

  if (error || !derivation)
    return (
      <PageContainer width="narrow">
        <EmptyState
          title={error ? 'Une erreur est survenue' : 'Dérivation introuvable'}
          description={
            error?.message ?? "Cette dérivation n'existe pas ou a été supprimée."
          }
        />
      </PageContainer>
    );

  return (
    <PageContainer width="narrow">
      <PageHeader
        icon={<ClipboardPen />}
        title="Formulaire d'Intervention"
        description="Complétez chaque étape du relevé sur le terrain."
      />
      <InfoCard
        reference={getDerivationReference(derivation)}
        status={derivation.status}
        chantier={derivation.chantier}
        createdAt={derivation.createdAt}
      />
      <MultiStepForm derivation={derivation} />
    </PageContainer>
  );
}
