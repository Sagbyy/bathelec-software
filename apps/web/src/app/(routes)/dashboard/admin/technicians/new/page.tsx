'use client';

import RegisterTechnicianForm from '@/features/users/ui/register-technician-form';

export default function CreateTechnician() {
  return (
    <div className="mx-3 my-4 bg-white p-5 lg:mx-auto lg:w-1/2">
      <div className="mb-6 space-y-2 text-center">
        <h1 className="text-3xl font-bold">Créer un compte de technicien</h1>
        <p className="text-muted-foreground">
          Entrer les informations du technicien
        </p>
      </div>
      <RegisterTechnicianForm />
    </div>
  );
}
