import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react/dist/iconify.js';
import { DataTable } from './data-table';
import { columns, User } from './columns';

const data: User[] = [
  {
    id: 4,
    email: 'julie@gmail.com',
    username: 'jgoncalves',
    role: 'technician',
    createdAt: '2024-10-06T10:16:13.438Z',
    firstName: 'Julien',
    lastName: 'Goncalves',
  },
  {
    id: 3,
    email: 'bernard@gmail.com',
    username: 'btimo',
    role: 'admin',
    createdAt: '2024-10-06T10:02:59.924Z',
    firstName: 'Bernard',
    lastName: 'Timote',
  },
  {
    id: 66,
    email: 'sbouhdjeur.gagny@gmail.com',
    username: 'qqqq',
    role: 'technician',
    createdAt: '2024-10-08T20:24:15.811Z',
    firstName: 'qqqqqqqq',
    lastName: 'qqqq',
  },
  {
    id: 71,
    email: 'mkerkouche@gmail.com',
    username: 'mkherkouche',
    role: 'technician',
    createdAt: '2024-10-15T17:26:32.790Z',
    firstName: 'Mohammed',
    lastName: 'Kherkouche',
  },
  {
    id: 2,
    email: 'Salah',
    username: 'Salahusername',
    role: 'admin',
    createdAt: '2024-09-30T20:17:13.561Z',
    firstName: 'le boss',
    lastName: 'le crack',
  },
  {
    id: 73,
    email: 'admin',
    username: 'admin',
    role: 'admin',
    createdAt: '2025-03-04T08:05:02.327Z',
    firstName: 'admin',
    lastName: 'admin',
  },
];

export default function ListUsersPage() {
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
      <DataTable columns={columns} data={data} />
      <p className="text-muted-foreground text-sm">
        <span className="font-bold">{data.length}</span> utilisateurs trouvés
      </p>
    </div>
  );
}
