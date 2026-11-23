'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { Chantier } from '@repo/types';
import { AlertTriangle } from 'lucide-react';
import { DataTable } from '@/shared/ui/data-table';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';
import { Skeleton } from '@/shared/ui/skeleton';
import { useCompletedDerivationsByIds } from '@/features/derivations/model/use-completed-derivations';
import { ChantierDocumentsSection } from '@/entities/chantier-document';
import { derivationColumns } from './derivation-columns';
import { toDerivationRow } from '../lib/derivation-row';

interface ChantierDerivationsViewProps {
  chantiers: Chantier[];
  chantierId: number;
  isLoading: boolean;
  error: unknown;
}

export function ChantierDerivationsView({
  chantiers,
  chantierId,
  isLoading,
  error,
}: ChantierDerivationsViewProps) {
  const chantier = useMemo(
    () => chantiers.find((c) => c.id === chantierId),
    [chantiers, chantierId]
  );
  const derivations = useMemo(() => chantier?.derivations ?? [], [chantier]);
  const derivationIds = useMemo(
    () => derivations.map((d) => d.id),
    [derivations]
  );

  const { byId } = useCompletedDerivationsByIds(derivationIds);

  const rows = useMemo(
    () => derivations.map((d) => toDerivationRow(d, byId.get(d.id))),
    [derivations, byId]
  );

  if (isLoading)
    return (
      <PageContainer>
        <Skeleton className="mb-8 h-12 w-72" />
        <Skeleton className="h-80 rounded-xl" />
        <span className="sr-only">Chargement...</span>
      </PageContainer>
    );
  if (error || !chantier)
    return (
      <PageContainer>
        <EmptyState
          icon={<AlertTriangle />}
          title={error ? 'Une erreur est survenue' : 'Chantier introuvable.'}
        />
      </PageContainer>
    );

  const fields = [
    { label: 'Marché', value: chantier.market?.name ?? '—' },
    {
      label: "N° d'affaire ENEDIS",
      value: chantier.enedisAffaireNumber ?? '—',
    },
    {
      label: "N° d'affaire interne",
      value: chantier.internalAffaireNumber ?? '—',
    },
  ];

  return (
    <PageContainer className="space-y-6">
      <PageHeader
        className="mb-0 md:mb-0"
        icon={
          <Image
            src="/images/builder.png"
            alt="Dossier chantier"
            width={28}
            height={28}
            className="object-contain"
          />
        }
        eyebrow="Chantier"
        title={chantier.address}
      />

      <dl className="bg-card shadow-card grid grid-cols-1 gap-3 rounded-xl border p-4 sm:grid-cols-3 sm:p-5">
        {fields.map(({ label, value }) => (
          <div key={label} className="min-w-0">
            <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              {label}
            </dt>
            <dd className="mt-0.5 truncate text-sm font-semibold">{value}</dd>
          </div>
        ))}
      </dl>

      <DataTable
        columns={derivationColumns}
        data={rows}
        searchPlaceholder="Rechercher une dérivation..."
        emptyMessage="Aucune dérivation."
      />

      <ChantierDocumentsSection chantierId={chantierId} />
    </PageContainer>
  );
}
