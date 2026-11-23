'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { Chantier } from '@repo/types';
import { AlertTriangle } from 'lucide-react';
import { DataTable } from '@/shared/ui/data-table';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';
import { Skeleton } from '@/shared/ui/skeleton';
import { buildChantierColumns } from './chantier-columns';

interface MarketChantiersViewProps {
  chantiers: Chantier[];
  marketId: number;
  basePath: string;
  isLoading: boolean;
  error: unknown;
  folderImageSrc: string;
}

export function MarketChantiersView({
  chantiers,
  marketId,
  basePath,
  isLoading,
  error,
  folderImageSrc,
}: MarketChantiersViewProps) {
  const filtered = useMemo(
    () => chantiers.filter((c) => c.marketId === marketId),
    [chantiers, marketId]
  );
  const columns = useMemo(() => buildChantierColumns(basePath), [basePath]);
  const marketName = filtered[0]?.market?.name;

  if (isLoading) return <ViewLoading />;
  if (error)
    return (
      <PageContainer>
        <EmptyState icon={<AlertTriangle />} title="Une erreur est survenue" />
      </PageContainer>
    );

  return (
    <PageContainer>
      <PageHeader
        icon={
          <Image
            src={folderImageSrc}
            alt=""
            width={28}
            height={28}
            className="object-contain"
          />
        }
        eyebrow="Marché"
        title={`${marketName ?? 'Marché'} — Chantiers`}
      />
      <DataTable
        columns={columns}
        data={filtered}
        searchPlaceholder="Rechercher un chantier..."
        emptyMessage="Aucun chantier."
      />
    </PageContainer>
  );
}

function ViewLoading() {
  return (
    <PageContainer>
      <Skeleton className="mb-8 h-12 w-72" />
      <Skeleton className="h-80 rounded-xl" />
      <span className="sr-only">Chargement...</span>
    </PageContainer>
  );
}
