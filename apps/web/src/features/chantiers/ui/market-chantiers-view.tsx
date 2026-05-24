'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { Chantier } from '@repo/types';
import { DataTable } from '@/shared/ui/data-table';
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

  if (isLoading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8">Une erreur est survenue</div>;

  return (
    <div className="mx-2 py-10 sm:mx-10">
      <div className="mb-6 flex items-center gap-3">
        <Image
          src={folderImageSrc}
          alt=""
          width={40}
          height={40}
          className="object-contain"
        />
        <h1 className="text-2xl font-bold">
          {marketName ?? 'Marché'} — Chantiers
        </h1>
      </div>
      <DataTable
        columns={columns}
        data={filtered}
        searchPlaceholder="Rechercher un chantier..."
        emptyMessage="Aucun chantier."
      />
    </div>
  );
}
