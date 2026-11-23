'use client';

import { Briefcase } from 'lucide-react';
import { EmptyState } from '@/shared/ui/empty-state';
import { Skeleton } from '@/shared/ui/skeleton';
import { useState } from 'react';
import {
  AffaireStats,
  summarizeByInternalAffaire,
} from '@/entities/derivation';
import { useDerivation } from '@/features/derivations';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';

export function AffaireStatsTable() {
  const { data: derivations, isLoading } = useDerivation();
  const [search, setSearch] = useState('');

  const query = search.trim().toUpperCase();
  const rows = summarizeByInternalAffaire(derivations ?? []).filter(
    (stats) =>
      stats.internalAffaireNumber.includes(query) ||
      stats.address.toUpperCase().includes(query)
  );

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Suivi par n° d'affaire interne</CardTitle>
          <CardDescription>
            Avancement des dérivations regroupées par affaire
          </CardDescription>
        </div>
        <Input
          placeholder="Rechercher une affaire..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full sm:w-64"
        />
      </CardHeader>
      <CardContent>
        <AffaireStatsContent isLoading={isLoading} rows={rows} />
      </CardContent>
    </Card>
  );
}

function AffaireStatsContent({
  isLoading,
  rows,
}: {
  isLoading: boolean;
  rows: AffaireStats[];
}) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-11 rounded-lg" />
        ))}
        <span className="sr-only">Chargement des statistiques...</span>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <EmptyState icon={<Briefcase />} title="Aucune affaire à afficher." />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>N° d'affaire</TableHead>
          <TableHead className="hidden md:table-cell">Chantier</TableHead>
          <TableHead className="text-right">Dérivations</TableHead>
          <TableHead className="text-right">Terminées</TableHead>
          <TableHead className="hidden text-right sm:table-cell">
            À valider
          </TableHead>
          <TableHead className="hidden text-right sm:table-cell">
            À corriger
          </TableHead>
          <TableHead className="text-right">Avancement</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((stats) => (
          <TableRow key={stats.internalAffaireNumber}>
            <TableCell className="font-medium">
              {stats.internalAffaireNumber}
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {stats.address}
            </TableCell>
            <TableCell className="text-right">{stats.total}</TableCell>
            <TableCell className="text-right">{stats.completed}</TableCell>
            <TableCell className="hidden text-right sm:table-cell">
              {stats.awaitingReview}
            </TableCell>
            <TableCell className="hidden text-right sm:table-cell">
              {stats.awaitingCorrection}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <div
                  aria-hidden="true"
                  className="bg-muted hidden h-1.5 w-16 overflow-hidden rounded-full sm:block"
                >
                  <div
                    className="bg-success h-full rounded-full"
                    style={{ width: `${Math.min(stats.completionRate, 100)}%` }}
                  />
                </div>
                <span className="tabular-nums">{stats.completionRate} %</span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
