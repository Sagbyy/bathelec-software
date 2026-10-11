'use client';

import Link from 'next/link';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useChantiers } from '@/entities/chantier';

export default function AdminChantiersListPage() {
  const { data: chantiers, isLoading, error } = useChantiers();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-8">
        <p>Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 p-8">
        <p className="text-destructive">Une erreur est survenue</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-8">
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        Chantiers
      </h2>

      {(chantiers?.length ?? 0) === 0 && (
        <p className="text-muted-foreground text-sm">Aucun chantier.</p>
      )}

      <ul className="flex flex-col gap-2">
        {chantiers?.map((chantier) => (
          <li key={chantier.id}>
            <Link
              href={`/dashboard/admin/chantiers/${chantier.id}`}
              className="hover:bg-muted flex items-center justify-between rounded-lg border p-4 transition"
            >
              <div className="flex flex-col">
                <span className="font-medium">{chantier.address}</span>
                <span className="text-muted-foreground text-xs">
                  {chantier.market?.name ?? '—'} · {chantier.enedisAffaireNumber}
                </span>
              </div>
              <Icon icon="mdi:chevron-right" className="h-5 w-5" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
