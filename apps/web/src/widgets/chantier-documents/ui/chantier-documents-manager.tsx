'use client';

import { Role } from '@repo/types';
import { ChantierDocumentsSection } from '@/entities/chantier-document';
import { useUserStore } from '@/entities/user';
import {
  ChantierDocumentDeleteButton,
  ChantierDocumentUploadForm,
} from '@/features/chantier-documents';

export function ChantierDocumentsManager({
  chantierId,
}: Readonly<{ chantierId: number }>) {
  const user = useUserStore((s) => s.user);
  const canManage =
    user?.role === Role.ADMIN || user?.role === Role.SUPERVISOR;

  return (
    <ChantierDocumentsSection
      chantierId={chantierId}
      toolbar={
        canManage ? (
          <ChantierDocumentUploadForm chantierId={chantierId} />
        ) : undefined
      }
      renderItemAction={
        canManage
          ? (documentItem) => (
              <ChantierDocumentDeleteButton
                chantierId={chantierId}
                documentItem={documentItem}
              />
            )
          : undefined
      }
    />
  );
}
