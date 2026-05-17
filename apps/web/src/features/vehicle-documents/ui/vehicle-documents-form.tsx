'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useUserStore } from '@/entities/user';
import {
  useUpsertVehicleDocument,
  useVehicleDocument,
} from '@/entities/vehicle-document';
import { DocumentUploadCard } from './document-upload-card';

export function VehicleDocumentsForm() {
  const user = useUserStore((s) => s.user);
  const userId = user?.id;

  const { data, isLoading } = useVehicleDocument(userId!);
  const { mutate, isPending } = useUpsertVehicleDocument(userId!);

  const [carteGrise, setCarteGrise] = useState<string | null>(null);
  const [permisDeConduire, setPermisDeConduire] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (data && !initialized.current) {
      setCarteGrise(data.carteGrise ?? null);
      setPermisDeConduire(data.permisDeConduire ?? null);
      initialized.current = true;
    }
  }, [data]);

  const handleCarteGriseChange = (value: string | null) => {
    setCarteGrise(value);
    mutate({ carteGrise: value, permisDeConduire });
  };

  const handlePermisChange = (value: string | null) => {
    setPermisDeConduire(value);
    mutate({ carteGrise, permisDeConduire: value });
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
        inputId="carte-grise-upload"
        value={carteGrise}
        onChange={handleCarteGriseChange}
        isPending={isPending}
      />

      <div className="border-t" />

      <DocumentUploadCard
        label="Permis de conduire"
        description="Photo ou scan du permis de conduire (jpeg, png, webp — max 5 Mo)"
        inputId="permis-upload"
        value={permisDeConduire}
        onChange={handlePermisChange}
        isPending={isPending}
      />
    </div>
  );
}
