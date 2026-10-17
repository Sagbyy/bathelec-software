'use client';

import { VehicleDocumentsForm } from '@/features/vehicle-documents';

export default function VehicleRegistrationPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Carte grise de mon véhicule
      </h1>
      <VehicleDocumentsForm documentKeys={['vehicleRegistration']} />
    </div>
  );
}
