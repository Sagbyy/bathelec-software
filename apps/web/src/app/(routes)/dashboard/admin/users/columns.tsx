'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Icon } from '@iconify/react/dist/iconify.js';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export type User = {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'username',
    header: "Nom d'utilisateur",
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'firstName',
    header: 'Prénom',
  },
  {
    accessorKey: 'lastName',
    header: 'Nom',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date de création',
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="cursor-default">
                {format(row.original.createdAt, 'MMM dd, yyyy')}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{format(row.original.createdAt, 'HH:mm')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'edit',
    header: 'Modifier',
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            router.push(`/dashboard/admin/users/edit/${row.original.id}`);
          }}
        >
          <Icon icon="material-symbols:edit-rounded" />
        </Button>
      );
    },
  },
];
