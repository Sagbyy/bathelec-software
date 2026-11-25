'use client';

import { Fragment } from 'react';
import { useUserStore } from '@/entities/user';
import { Spinner } from '@/shared/ui/spinner';
import {
  OFFICIAL_DOCUMENT_FIELDS,
  OFFICIAL_DOCUMENT_KEYS,
  OfficialDocumentKey,
  useOfficialDocument,
  useUpsertOfficialDocument,
} from '@/entities/official-document';
import { DocumentUploadCard } from '@/shared/ui/document-upload-card';

interface OfficialDocumentsFormProps {
  documentKeys?: OfficialDocumentKey[];
}

export function OfficialDocumentsForm({
  documentKeys = OFFICIAL_DOCUMENT_KEYS,
}: OfficialDocumentsFormProps = {}) {
  const currentUser = useUserStore((s) => s.user);
  const userId = currentUser?.id;

  const { data, isLoading } = useOfficialDocument(userId!);
  const { mutate, isPending } = useUpsertOfficialDocument(userId!);

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
