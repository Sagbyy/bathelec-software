'use client';

import { AlertTriangle, CalendarDays, MapPin } from 'lucide-react';
import {
  formatChantierSchedule,
  useScheduledChantiers,
} from '@/entities/chantier';
import { Card, CardContent } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { Skeleton } from '@/shared/ui/skeleton';

export function ScheduledChantiersList() {
  const { data: chantiers, isLoading, isError } = useScheduledChantiers();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-[104px] rounded-xl" />
        <Skeleton className="h-[104px] rounded-xl" />
        <span className="sr-only">Chargement...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={<AlertTriangle />}
        title="Impossible de charger les chantiers programmés."
      />
    );
  }

  if (!chantiers?.length) {
    return (
      <EmptyState
        icon={<CalendarDays />}
        title="Aucun chantier programmé pour le moment."
      />
    );
  }

  return (
    <ul className="space-y-3">
      {chantiers.map((chantier) => (
        <li key={chantier.id}>
          <Card>
            <CardContent className="flex flex-col gap-2 p-4">
              <p className="text-foreground flex items-center gap-2 font-semibold">
                <span className="bg-primary-soft text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
                  <CalendarDays className="size-4" />
                </span>
                {formatChantierSchedule(chantier)}
              </p>
              <p className="text-foreground flex items-center gap-2 text-sm">
                <MapPin className="text-muted-foreground h-4 w-4 shrink-0" />
                {chantier.address}
              </p>
              <p className="text-muted-foreground text-xs">
                {chantier.market?.name ?? '—'} · N° interne{' '}
                {chantier.internalAffaireNumber}
              </p>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
