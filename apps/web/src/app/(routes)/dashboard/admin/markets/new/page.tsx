'use client';

import { CreateMarketForm } from '@/features/chantiers';

export default function CreateMarketPage() {
  return (
    <div className="mx-3 my-4 bg-white p-5 lg:mx-auto lg:w-1/2">
      <div className="mb-6 space-y-2 text-center">
        <h1 className="text-3xl font-bold">Créer un marché</h1>
        <p className="text-muted-foreground">
          Ajouter un marché pour y rattacher des chantiers
        </p>
      </div>
      <CreateMarketForm />
    </div>
  );
}
