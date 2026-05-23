'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useUserStore } from '@/entities/user';
import {
  useUpsertVehicleDocument,
  useVehicleDocument,
} from '@/entities/vehicle-document';
import { DocumentUploadCard } from '@/shared/ui/document-upload-card';

export default function DrivingLicensePage() {
  const user = useUserStore((s) => s.user);
  const userId = user?.id;

  const { data, isLoading } = useVehicleDocument(userId!);
  const { mutate, isPending } = useUpsertVehicleDocument(userId!);

  const [drivingLicense, setDrivingLicense] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (data && !initialized.current) {
      setDrivingLicense(data.drivingLicense ?? null);
      initialized.current = true;
    }
  }, [data]);

  const handleChange = (value: string | null) => {
    setDrivingLicense(value);
    mutate({ vehicleRegistration: data?.vehicleRegistration ?? null, drivingLicense: value });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <Link
        href="/dashboard/technician/vehicule"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Link>

      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Mon permis de conduire
      </h1>

      {isLoading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <DocumentUploadCard
          label="Permis de conduire"
          description="Photo ou scan du permis de conduire (jpeg, png, webp — max 5 Mo)"
          inputId="driving-license-upload"
          value={drivingLicense}
          onChange={handleChange}
          isPending={isPending}
        />
      )}
    </div>
  );
}
