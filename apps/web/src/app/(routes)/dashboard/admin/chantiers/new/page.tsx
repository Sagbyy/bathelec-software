'use client';

import { CreateChantierForm } from '@/features/chantiers';

export default function CreateChantierPage() {
  return (
    <div className="mx-3 my-4 bg-white p-5 lg:mx-auto lg:w-1/2">
      <div className="mb-6 space-y-2 text-center">
        <h1 className="text-3xl font-bold">Créer un chantier</h1>
        <p className="text-muted-foreground">
          Renseigner les informations du chantier et son marché associé
        </p>
      </div>
      <CreateChantierForm />
    </div>
  );
}
