'use client';

import { AlertTriangle, UsersRound } from 'lucide-react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { PageContainer } from '@/shared/ui/page-container';
import { PageHeader } from '@/shared/ui/page-header';
import { Skeleton } from '@/shared/ui/skeleton';
import { DataTable } from '@/features/users/ui/users-data-table/data-table';
import { columns } from '@/features/users/ui/users-data-table/columns';
import { useUsers } from '@/features/users/model/use-user';

export default function ListUsersPage() {
  const { data, isLoading, error } = useUsers();

  if (isLoading) {
    return (
      <PageContainer>
        <Skeleton className="mb-8 h-12 w-64" />
        <Skeleton className="h-96 w-full rounded-xl" />
        <span className="sr-only">Chargement...</span>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <EmptyState
          icon={<AlertTriangle />}
          title="Impossible de charger la liste"
          description={
            error instanceof Error ? error.message : 'Une erreur est survenue'
          }
        />
      </PageContainer>
    );
  }

  const users = data || [];

  return (
    <PageContainer>
      <PageHeader
        icon={<UsersRound />}
        title="Utilisateurs"
        description="Gérez les comptes et les rôles de la plateforme"
        actions={
          <Button variant="outline">
            <Icon icon="hugeicons:csv-02" />
            Télécharger CSV
          </Button>
        }
      />
      <DataTable columns={columns} data={users} />
      <p className="text-muted-foreground mt-2 text-sm">
        <span className="text-foreground font-semibold">{users.length}</span>{' '}
        utilisateurs trouvés
      </p>
    </PageContainer>
  );
}
