'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useUserStore } from '@/entities/user';
import {
  useUpsertVehicleDocument,
  useVehicleDocument,
} from '@/entities/vehicle-document';
import { DocumentUploadCard } from '@/shared/ui/document-upload-card';

export default function VehicleRegistrationPage() {
  const user = useUserStore((s) => s.user);
  const userId = user?.id;

  const { data, isLoading } = useVehicleDocument(userId!);
  const { mutate, isPending } = useUpsertVehicleDocument(userId!);

  const [vehicleRegistration, setVehicleRegistration] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (data && !initialized.current) {
      setVehicleRegistration(data.vehicleRegistration ?? null);
      initialized.current = true;
    }
  }, [data]);

  const handleChange = (value: string | null) => {
    setVehicleRegistration(value);
    mutate({ vehicleRegistration: value, drivingLicense: data?.drivingLicense ?? null });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Carte grise de mon véhicule
      </h1>

      {isLoading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <DocumentUploadCard
          label="Carte grise"
          description="Photo ou scan de la carte grise du véhicule (jpeg, png, webp — max 5 Mo)"
          inputId="vehicle-registration-upload"
          value={vehicleRegistration}
          onChange={handleChange}
          isPending={isPending}
        />
      )}
    </div>
  );
}
