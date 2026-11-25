'use client';

import { Fragment } from 'react';
import { useUserStore } from '@/entities/user';
import { Spinner } from '@/shared/ui/spinner';
import {
  VEHICLE_DOCUMENT_FIELDS,
  VEHICLE_DOCUMENT_KEYS,
  VehicleDocumentKey,
  useUpsertVehicleDocument,
  useVehicleDocument,
} from '@/entities/vehicle-document';
import { DocumentUploadCard } from '@/shared/ui/document-upload-card';

interface VehicleDocumentsFormProps {
  documentKeys?: VehicleDocumentKey[];
}

export function VehicleDocumentsForm({
  documentKeys = VEHICLE_DOCUMENT_KEYS,
}: VehicleDocumentsFormProps = {}) {
  const user = useUserStore((s) => s.user);
  const userId = user?.id;

  const { data, isLoading } = useVehicleDocument(userId!);
  const { mutate, isPending } = useUpsertVehicleDocument(userId!);

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-xl border bg-card p-4 shadow-card sm:p-6">
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
