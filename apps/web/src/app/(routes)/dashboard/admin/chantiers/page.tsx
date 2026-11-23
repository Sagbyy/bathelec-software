'use client';

import Link from 'next/link';
import {
  AlertTriangle,
  ChevronRight,
  HardHat,
  MapPin,
  Plus,
} from 'lucide-react';
import { useChantiers } from '@/entities/chantier';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';
import { Skeleton } from '@/shared/ui/skeleton';

export default function AdminChantiersListPage() {
  const { data: chantiers, isLoading, error } = useChantiers();

  return (
    <PageContainer>
      <PageHeader
        icon={<HardHat />}
        title="Chantiers"
        description="Consultez les chantiers et gérez leurs documents"
        actions={
          <Button asChild>
            <Link href="/dashboard/admin/chantiers/new">
              <Plus />
              Nouveau chantier
            </Link>
          </Button>
        }
      />

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-[72px] rounded-xl" />
          ))}
          <span className="sr-only">Chargement...</span>
        </div>
      )}

      {error && (
        <EmptyState
          icon={<AlertTriangle />}
          title="Une erreur est survenue"
          description="Impossible de charger les chantiers. Réessayez plus tard."
        />
      )}

      {!isLoading && !error && (chantiers?.length ?? 0) === 0 && (
        <EmptyState
          icon={<HardHat />}
          title="Aucun chantier."
          description="Créez un premier chantier pour commencer."
        />
      )}

      {!isLoading && !error && (chantiers?.length ?? 0) > 0 && (
        <ul className="bg-card shadow-card divide-y overflow-hidden rounded-xl border">
          {chantiers?.map((chantier) => (
            <li key={chantier.id}>
              <Link
                href={`/dashboard/admin/chantiers/${chantier.id}`}
                className="hover:bg-muted/50 group flex min-h-[72px] items-center gap-4 px-4 py-3 transition-colors sm:px-5"
              >
                <span className="bg-primary-soft text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                  <MapPin className="size-5" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-medium">
                    {chantier.address}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {chantier.market?.name ?? '—'} ·{' '}
                    {chantier.enedisAffaireNumber}
                  </span>
                </span>
                <ChevronRight className="text-muted-foreground group-hover:text-primary size-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageContainer>
  );
}
