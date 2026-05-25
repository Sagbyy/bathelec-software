'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { Chantier } from '@repo/types';
import { DataTable } from '@/shared/ui/data-table';
import { useCompletedDerivationsByIds } from '@/features/derivations/model/use-completed-derivations';
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
  const derivations = useMemo(
    () => chantier?.derivations ?? [],
    [chantier]
  );
  const derivationIds = useMemo(
    () => derivations.map((d) => d.id),
    [derivations]
  );

  const { byId } = useCompletedDerivationsByIds(derivationIds);

  const rows = useMemo(
    () => derivations.map((d) => toDerivationRow(d, byId.get(d.id))),
    [derivations, byId]
  );

  if (isLoading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8">Une erreur est survenue</div>;
  if (!chantier) return <div className="p-8">Chantier introuvable.</div>;

  const fields = [
    { label: 'Marché', value: chantier.market?.name ?? '—' },
    { label: "N° d'affaire ENEDIS", value: chantier.enedisAffaireNumber ?? '—' },
    { label: "N° d'affaire interne", value: chantier.internalAffaireNumber ?? '—' },
  ];

  return (
    <div className="mx-2 py-10 sm:mx-10">
      <div className="mb-6">
        <div className="flex items-center gap-6">
          <Image
            src="/images/builder.png"
            alt="Dossier chantier"
            width={80}
            height={80}
            className="shrink-0 object-contain"
          />
          <h1 className="text-2xl font-bold sm:text-3xl">{chantier.address}</h1>
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          {fields.map(({ label, value }) => (
            <div key={label} className="inline-flex flex-col">
              <span className="rounded-xl bg-black px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-white whitespace-nowrap">
                {label}
              </span>
              <span className="px-4 py-2 text-sm font-semibold text-black whitespace-nowrap">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <DataTable
        columns={derivationColumns}
        data={rows}
        searchPlaceholder="Rechercher une dérivation..."
        emptyMessage="Aucune dérivation."
      />
    </div>
  );
}
