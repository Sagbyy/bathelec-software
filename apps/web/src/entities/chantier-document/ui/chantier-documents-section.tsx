'use client';

import { useState } from 'react';
import {
  CHANTIER_DOCUMENT_TYPE_LABELS,
  ChantierDocumentType,
} from '@repo/types';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Icon } from '@iconify/react/dist/iconify.js';
import { toast } from 'sonner';
import { chantierDocumentService } from '../api/chantier-document.service';
import { useChantierDocuments } from '../model/use-chantier-documents';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function ChantierDocumentsSection({
  chantierId,
}: {
  chantierId: number;
}) {
  const { data: documents, isLoading, error } =
    useChantierDocuments(chantierId);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (id: string, name: string) => {
    try {
      setDownloadingId(id);
      const file = await chantierDocumentService.getOne(id);
      const link = document.createElement('a');
      link.href = file.file;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error('Échec du téléchargement du document');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-bold">Documents du chantier</h2>

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
            key={documentItem.id}
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
            <Button
              variant="ghost"
              size="icon"
              title="Télécharger"
              onClick={() => handleDownload(documentItem.id, documentItem.name)}
              disabled={downloadingId === documentItem.id}
            >
              <Icon icon="mdi:download" className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
