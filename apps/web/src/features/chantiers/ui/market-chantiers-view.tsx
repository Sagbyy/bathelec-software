'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Chantier } from '@repo/types';
import { Button } from '@/shared/ui/button';
import { Icon } from '@iconify/react/dist/iconify.js';
import { DataTable } from '@/shared/ui/data-table';
import { buildChantierColumns } from './chantier-columns';

interface MarketChantiersViewProps {
  chantiers: Chantier[];
  marketId: number;
  basePath: string;
  isLoading: boolean;
  error: unknown;
}

export function MarketChantiersView({
  chantiers,
  marketId,
  basePath,
  isLoading,
  error,
}: MarketChantiersViewProps) {
  const router = useRouter();

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
      <Button
        variant="secondary"
        size="sm"
        onClick={() => router.back()}
        className="mb-4"
      >
        <Icon icon="mdi:arrow-left" />
        <span>Retour</span>
      </Button>
      <h1 className="mb-2 text-2xl font-bold">
        {marketName ?? 'Marché'} — Chantiers
      </h1>
      <DataTable
        columns={columns}
        data={filtered}
        searchPlaceholder="Rechercher un chantier..."
        emptyMessage="Aucun chantier."
      />
    </div>
  );
}
