'use client';

import { ScheduledChantiersList } from '@/features/chantiers';

export default function ScheduledChantiersPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 md:px-8">
      <h1 className="mb-6 text-2xl font-bold">Chantiers programmés</h1>
      <ScheduledChantiersList />
    </div>
  );
}
