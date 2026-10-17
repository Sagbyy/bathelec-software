'use client';

import { Fragment } from 'react';
import { Loader2 } from 'lucide-react';
import { useUserStore } from '@/entities/user';
import {
  VehicleDocumentKey,
  useUpsertVehicleDocument,
  useVehicleDocument,
} from '@/entities/vehicle-document';
import { DocumentUploadCard } from '@/shared/ui/document-upload-card';

const VEHICLE_DOCUMENT_FIELDS: Record<
  VehicleDocumentKey,
  { label: string; description: string; inputId: string }
> = {
  vehicleRegistration: {
    label: 'Carte grise',
    description:
      'Photo ou scan de la carte grise du véhicule (jpeg, png, webp — max 5 Mo)',
    inputId: 'vehicle-registration-upload',
  },
  drivingLicense: {
    label: 'Permis de conduire',
    description:
      'Photo ou scan du permis de conduire (jpeg, png, webp — max 5 Mo)',
    inputId: 'driving-license-upload',
  },
};

const ALL_DOCUMENT_KEYS = Object.keys(
  VEHICLE_DOCUMENT_FIELDS
) as VehicleDocumentKey[];

interface VehicleDocumentsFormProps {
  documentKeys?: VehicleDocumentKey[];
}

export function VehicleDocumentsForm({
  documentKeys = ALL_DOCUMENT_KEYS,
}: VehicleDocumentsFormProps = {}) {
  const user = useUserStore((s) => s.user);
  const userId = user?.id;

  const { data, isLoading } = useVehicleDocument(userId!);
  const { mutate, isPending } = useUpsertVehicleDocument(userId!);

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {documentKeys.map((documentKey, index) => {
        const expiryKey = `${documentKey}ExpiresAt` as const;
        return (
          <Fragment key={documentKey}>
            {index > 0 && <div className="border-t" />}
            <DocumentUploadCard
              {...VEHICLE_DOCUMENT_FIELDS[documentKey]}
              value={data?.[documentKey] ?? null}
              expiresAt={data?.[expiryKey] ?? null}
              onChange={(value, expiresAt) =>
                mutate(
                  value === null
                    ? { [documentKey]: null }
                    : { [documentKey]: value, [expiryKey]: expiresAt }
                )
              }
              onExpiresAtChange={(expiresAt) =>
                mutate({ [expiryKey]: expiresAt })
              }
              isPending={isPending}
            />
          </Fragment>
        );
      })}
    </div>
  );
}
