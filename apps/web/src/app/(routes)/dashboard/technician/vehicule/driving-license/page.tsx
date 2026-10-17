'use client';

import { VehicleDocumentsForm } from '@/features/vehicle-documents';

export default function DrivingLicensePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Mon permis de conduire
      </h1>
      <VehicleDocumentsForm documentKeys={['drivingLicense']} />
    </div>
  );
}
