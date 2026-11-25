'use client';

import { useUserStore } from '@/entities/user';
import {
  OfficialDocumentKey,
  useOfficialDocument,
} from '@/entities/official-document';
import { DocumentValidityBadge } from '@/shared/ui/validity-date-field';

export function OwnOfficialDocumentBadge({
  documentKey,
}: {
  documentKey: OfficialDocumentKey;
}) {
  const userId = useUserStore((s) => s.user?.id);
  const { data, isLoading } = useOfficialDocument(userId!);

  if (isLoading) return null;

  return (
    <DocumentValidityBadge
      hasDocument={!!data?.[documentKey]}
      expiresAt={data?.[`${documentKey}ExpiresAt`]}
    />
  );
}
