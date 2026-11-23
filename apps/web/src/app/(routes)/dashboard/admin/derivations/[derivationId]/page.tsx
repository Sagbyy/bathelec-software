'use client';

import CorrectionComment from '@/features/derivations/ui/admin/correction-comment';
import { ExportEnedisButton } from '@/features/enedis-export';
import { InfoCard } from '@/features/derivations/ui/info-derivation-card';
import { getDerivationReference } from '@/entities/derivation';
import { DerivationTeamCard } from '@/features/derivations';
import { MultiStepForm } from '@/features/derivations/ui/multi-step-form';
import { Button } from '@/shared/ui/button';
import { useDerivationById } from '@/features/derivations/model/use-derivation';
import { AlertTriangle, ArrowLeft, ClipboardList } from 'lucide-react';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDerivationStatusStore } from '@/entities/derivation/model/use-derivation-status.store';
import { PageLoader } from '@/shared/ui/page-loader';

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

  if (isLoading) return <PageLoader inline />;
  if (error || !derivation)
    return (
      <PageContainer width="default">
        <EmptyState
          icon={<AlertTriangle />}
          title={error ? 'Une erreur est survenue' : 'Dérivation introuvable'}
          description={error?.message}
        />
      </PageContainer>
    );

  return (
    <PageContainer width="default" className="space-y-6 md:space-y-8">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2"
        onClick={() => router.back()}
      >
        <ArrowLeft />
        Retour
      </Button>
      <PageHeader
        className="mb-0 md:mb-0"
        icon={<ClipboardList />}
        title="Formulaire d'Intervention"
        actions={<ExportEnedisButton scope="derivations" id={derivation.id} />}
      />
      <CorrectionComment derivation={derivation} />
      <InfoCard
        reference={getDerivationReference(derivation)}
        status={derivation?.status}
        chantier={derivation?.chantier}
        createdAt={derivation?.createdAt}
      />
      <DerivationTeamCard derivation={derivation} />
      <MultiStepForm derivation={derivation} readOnly={true} />
    </PageContainer>
  );
}
