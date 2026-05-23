'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useUserStore } from '@/entities/user';
import {
  useUpsertVehicleDocument,
  useVehicleDocument,
} from '@/entities/vehicle-document';
import { DocumentUploadCard } from '@/shared/ui/document-upload-card';

export function VehicleDocumentsForm() {
  const user = useUserStore((s) => s.user);
  const userId = user?.id;

  const { data, isLoading } = useVehicleDocument(userId!);
  const { mutate, isPending } = useUpsertVehicleDocument(userId!);

  const [vehicleRegistration, setVehicleRegistration] = useState<string | null>(
    null
  );
  const [drivingLicense, setDrivingLicense] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (data && !initialized.current) {
      setVehicleRegistration(data.vehicleRegistration ?? null);
      setDrivingLicense(data.drivingLicense ?? null);
      initialized.current = true;
    }
  }, [data]);

  const handleVehicleRegistrationChange = (value: string | null) => {
    setVehicleRegistration(value);
    mutate({ vehicleRegistration: value, drivingLicense });
  };

  const handleDrivingLicenseChange = (value: string | null) => {
    setDrivingLicense(value);
    mutate({ vehicleRegistration, drivingLicense: value });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DocumentUploadCard
        label="Carte grise"
        description="Photo ou scan de la carte grise du véhicule (jpeg, png, webp — max 5 Mo)"
        inputId="vehicle-registration-upload"
        value={vehicleRegistration}
        onChange={handleVehicleRegistrationChange}
        isPending={isPending}
      />

      <div className="border-t" />

      <DocumentUploadCard
        label="Permis de conduire"
        description="Photo ou scan du permis de conduire (jpeg, png, webp — max 5 Mo)"
        inputId="driving-license-upload"
        value={drivingLicense}
        onChange={handleDrivingLicenseChange}
        isPending={isPending}
      />
    </div>
  );
}
