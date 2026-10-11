'use client';

import { ReactNode } from 'react';
import {
  CHANTIER_DOCUMENT_TYPE_LABELS,
  ChantierDocument,
  ChantierDocumentType,
} from '@repo/types';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  useChantierDocuments,
  useChantierDocumentDownload,
} from '../model/use-chantier-documents';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function ChantierDocumentsSection({
  chantierId,
  toolbar,
  renderItemAction,
}: Readonly<{
  chantierId: number;
  toolbar?: ReactNode;
  renderItemAction?: (document: ChantierDocument) => ReactNode;
}>) {
  const { data: documents, isLoading, error } =
    useChantierDocuments(chantierId);
  const { download, downloadingId } = useChantierDocumentDownload();

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-bold">Documents du chantier</h2>

      {toolbar && <div className="mb-6">{toolbar}</div>}

      {isLoading && <p>Chargement...</p>}
      {error && <p className="text-destructive">Une erreur est survenue</p>}

      {!isLoading && !error && (documents?.length ?? 0) === 0 && (
        <p className="text-muted-foreground text-sm">
          Aucun document disponible.
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {documents?.map((documentItem) => (
          <li
            key={documentItem._id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="flex flex-col gap-1">
              <span className="font-medium">{documentItem.name}</span>
              <span className="text-muted-foreground flex items-center gap-2 text-xs">
                <Badge variant="secondary">
                  {CHANTIER_DOCUMENT_TYPE_LABELS[
                    documentItem.type as ChantierDocumentType
                  ] ?? documentItem.type}
                </Badge>
                {formatSize(documentItem.size)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                title="Télécharger"
                onClick={() => download(documentItem)}
                disabled={downloadingId === documentItem._id}
              >
                <Icon icon="mdi:download" className="h-4 w-4" />
              </Button>
              {renderItemAction?.(documentItem)}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
