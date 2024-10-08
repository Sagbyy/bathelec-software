'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  return (
    <div className="p-4">
      <h1>Admin Panel</h1>
      <div>
        <Button onClick={() => router.push('/protected/create-technician')}>
          Créer un technicien
        </Button>
      </div>
    </div>
  );
}
