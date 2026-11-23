'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AlertTriangle, ArrowLeft, MapPin } from 'lucide-react';
import { Role } from '@repo/types';
import { formatChantierSchedule, useChantiers } from '@/entities/chantier';
import { useUserStore } from '@/entities/user';
import { ChantierScheduleCard } from '@/features/chantiers';
import { ChantierDocumentsManager } from '@/widgets/chantier-documents';
import { ExportEnedisButton } from '@/features/enedis-export';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';
import { Skeleton } from '@/shared/ui/skeleton';

export default function AdminChantierDetailPage() {
  const { chantierId } = useParams();
  const chantierIdNumber = parseInt(chantierId as string);
  const { data: chantiers, isLoading, error } = useChantiers();
  const { user } = useUserStore();
  const chantier = chantiers?.find((item) => item.id === chantierIdNumber);

  if (isLoading) {
    return (
      <PageContainer>
        <Skeleton className="mb-6 h-12 w-2/3" />
        <Skeleton className="h-64 rounded-xl" />
        <span className="sr-only">Chargement...</span>
      </PageContainer>
    );
  }

  if (error || !chantier) {
    return (
      <PageContainer>
        <EmptyState
          icon={<AlertTriangle />}
          title={error ? 'Une erreur est survenue' : 'Chantier introuvable.'}
          action={
            <Button asChild variant="outline">
              <Link href="/dashboard/admin/chantiers">
                Retour aux chantiers
              </Link>
            </Button>
          }
        />
      </PageContainer>
    );
  }

  const details = [
    { label: 'Marché', value: chantier.market?.name ?? '—' },
    { label: 'N° ENEDIS', value: chantier.enedisAffaireNumber },
    { label: 'N° interne', value: chantier.internalAffaireNumber },
    { label: 'Planning', value: formatChantierSchedule(chantier) },
  ];

  return (
    <PageContainer className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href="/dashboard/admin/chantiers">
          <ArrowLeft />
          Retour aux chantiers
        </Link>
      </Button>

      <PageHeader
        className="mb-0 md:mb-0"
        icon={<MapPin />}
        eyebrow="Chantier"
        title={chantier.address}
        actions={
          <ExportEnedisButton
            scope="chantiers"
            id={chantier.id}
            label="Exporter le chantier (Excel Enedis)"
          />
        }
      />

      <dl className="bg-card shadow-card grid grid-cols-2 gap-3 rounded-xl border p-4 sm:p-5 lg:grid-cols-4">
        {details.map(({ label, value }) => (
          <div key={label} className="min-w-0">
            <dt className="text-muted-foreground text-xs font-medium">
              {label}
            </dt>
            <dd className="mt-0.5 truncate text-sm font-medium">{value}</dd>
          </div>
        ))}
      </dl>

      {user?.role === Role.ADMIN && (
        <ChantierScheduleCard chantier={chantier} />
      )}

      <ChantierDocumentsManager chantierId={chantierIdNumber} />
    </PageContainer>
  );
}
