'use client';

import { TeamDerivationsList } from '@/features/derivations';

export default function TechnicianAssignmentsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 md:px-8">
      <h1 className="mb-6 text-2xl font-bold">Mes dérivations</h1>
      <TeamDerivationsList />
    </div>
  );
}
