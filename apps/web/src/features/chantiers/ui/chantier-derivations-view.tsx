'use client';

import { useMemo } from 'react';
import { HardHat } from 'lucide-react';
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

  return (
    <div className="mx-2 py-10 sm:mx-10">
      <div className="mb-6 flex items-start gap-6 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-blue-500 sm:h-24 sm:w-24">
          <HardHat
            className="h-12 w-12 text-white sm:h-14 sm:w-14"
            strokeWidth={1.75}
          />
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold sm:text-3xl">{chantier.address}</h1>
          <div>
            <p className="text-lg font-semibold text-blue-700">Marché</p>
            <ul className="text-muted-foreground mt-1 space-y-0.5 text-sm">
              <li>{chantier.market?.name ?? '—'}</li>
              <li>
                <span className="font-medium text-slate-700">
                  N° d&apos;affaire ENEDIS :
                </span>{' '}
                {chantier.enedisAffaireNumber}
              </li>
              <li>
                <span className="font-medium text-slate-700">
                  N° d&apos;affaire interne :
                </span>{' '}
                {chantier.internalAffaireNumber}
              </li>
            </ul>
          </div>
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
