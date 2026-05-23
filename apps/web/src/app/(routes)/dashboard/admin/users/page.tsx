'use client';

import { Button } from '@/shared/ui/button';
import { Icon } from '@iconify/react/dist/iconify.js';
import { DataTable } from '@/features/users/ui/users-data-table/data-table';
import { columns } from '@/features/users/ui/users-data-table/columns';
import { useUsers } from '@/features/users/model/use-user';

export default function ListUsersPage() {
  const { data, isLoading, error } = useUsers();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-8">
        <div className="flex items-center justify-center py-12">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 p-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-destructive">
            Erreur:{' '}
            {error instanceof Error ? error.message : 'Une erreur est survenue'}
          </p>
        </div>
      </div>
    );
  }

  const users = data || [];

  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex items-center justify-between">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Utilisateurs
        </h2>
        <div>
          <Button variant="outline">
            <Icon icon="hugeicons:csv-02" />
            Télécharger CSV
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={users} />
      <p className="text-muted-foreground text-sm">
        <span className="font-bold">{users.length}</span> utilisateurs trouvés
      </p>
    </div>
  );
}
