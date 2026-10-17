'use client';

import { CalendarDays, MapPin } from 'lucide-react';
import {
  formatChantierSchedule,
  useScheduledChantiers,
} from '@/entities/chantier';
import { Card, CardContent } from '@/shared/ui/card';

export function ScheduledChantiersList() {
  const { data: chantiers, isLoading, isError } = useScheduledChantiers();

  if (isLoading) {
    return <p className="text-muted-foreground">Chargement...</p>;
  }

  if (isError) {
    return (
      <p className="text-destructive">
        Impossible de charger les chantiers programmés.
      </p>
    );
  }

  if (!chantiers?.length) {
    return (
      <p className="text-muted-foreground">
        Aucun chantier programmé pour le moment.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {chantiers.map((chantier) => (
        <li key={chantier.id}>
          <Card>
            <CardContent className="flex flex-col gap-2 p-4">
              <p className="flex items-center gap-2 font-semibold text-gray-900">
                <CalendarDays className="h-4 w-4 shrink-0 text-slate-500" />
                {formatChantierSchedule(chantier)}
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-700">
                <MapPin className="h-4 w-4 shrink-0 text-slate-500" />
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
