'use client';

import { useUserStore } from '@/entities/user';
import {
  VehicleDocumentKey,
  useVehicleDocument,
} from '@/entities/vehicle-document';
import { DocumentValidityBadge } from '@/shared/ui/validity-date-field';

export function OwnVehicleDocumentBadge({
  documentKey,
}: {
  documentKey: VehicleDocumentKey;
}) {
  const userId = useUserStore((s) => s.user?.id);
  const { data, isLoading } = useVehicleDocument(userId!);

  if (isLoading) return null;

  return (
    <DocumentValidityBadge
      hasDocument={!!data?.[documentKey]}
      expiresAt={data?.[`${documentKey}ExpiresAt`]}
    />
  );
}
