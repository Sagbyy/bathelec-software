'use client';

import { Fragment } from 'react';
import { Loader2 } from 'lucide-react';
import { useUserStore } from '@/entities/user';
import {
  OfficialDocumentKey,
  useOfficialDocument,
  useUpsertOfficialDocument,
  useUpdateOfficialDocumentByUser,
} from '@/entities/official-document';
import { DocumentUploadCard } from '@/shared/ui/document-upload-card';

const OFFICIAL_DOCUMENT_FIELDS: Record<
  OfficialDocumentKey,
  { label: string; description: string; inputId: string }
> = {
  idCard: {
    label: "Pièce d'identité ou titre de séjour",
    description:
      "Carte nationale d'identité, passeport ou titre de séjour (jpeg, png, webp — max 5 Mo)",
    inputId: 'id-card-upload',
  },
  btpCard: {
    label: 'Carte professionnelle BTP',
    description: 'Carte BTP en cours de validité (jpeg, png, webp — max 5 Mo)',
    inputId: 'btp-card-upload',
  },
  mutualCard: {
    label: 'Carte mutuelle',
    description:
      'Attestation ou carte de mutuelle (jpeg, png, webp — max 5 Mo)',
    inputId: 'mutual-card-upload',
  },
};

const ALL_DOCUMENT_KEYS = Object.keys(
  OFFICIAL_DOCUMENT_FIELDS
) as OfficialDocumentKey[];

interface OfficialDocumentsFormProps {
  userId?: number;
  documentKeys?: OfficialDocumentKey[];
}

export function OfficialDocumentsForm({
  userId,
  documentKeys = ALL_DOCUMENT_KEYS,
}: OfficialDocumentsFormProps = {}) {
  const currentUser = useUserStore((s) => s.user);
  const managed = userId != null;
  const targetUserId = userId ?? currentUser?.id;

  const { data, isLoading, error } = useOfficialDocument(targetUserId!);
  const selfUpsert = useUpsertOfficialDocument(targetUserId!);
  const managedUpdate = useUpdateOfficialDocumentByUser(targetUserId!);
  const { mutate, isPending } = managed ? managedUpdate : selfUpsert;

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (managed && error) {
    return (
      <p className="text-destructive text-sm">
        Impossible de charger les documents de cet utilisateur.
      </p>
    );
  }

  if (managed && !data) {
    return (
      <p className="text-muted-foreground text-sm">
        Ce technicien n&apos;a pas encore enregistré de documents officiels.
      </p>
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
              {...OFFICIAL_DOCUMENT_FIELDS[documentKey]}
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
