'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChantierDocument } from '@repo/types';
import { toast } from 'sonner';
import {
  chantierDocumentService,
  CreateChantierDocumentInput,
} from '../api/chantier-document.service';

export const chantierDocumentsKey = (chantierId: number) =>
  ['chantier-documents', chantierId] as const;

export const useChantierDocuments = (chantierId: number) =>
  useQuery<ChantierDocument[]>({
    queryKey: chantierDocumentsKey(chantierId),
    queryFn: () => chantierDocumentService.getByChantier(chantierId),
    enabled: Number.isFinite(chantierId),
  });

export const useCreateChantierDocument = (chantierId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateChantierDocumentInput) =>
      chantierDocumentService.create(chantierId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chantierDocumentsKey(chantierId),
      });
    },
  });
};

export const useDeleteChantierDocument = (chantierId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => chantierDocumentService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chantierDocumentsKey(chantierId),
      });
    },
  });
};

const MIME_EXTENSIONS: Record<string, string> = {
  'application/pdf': '.pdf',
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

function buildFileName(name: string, mimeType: string): string {
  if (name.includes('.')) return name;
  return `${name}${MIME_EXTENSIONS[mimeType] ?? ''}`;
}

export function useChantierDocumentDownload() {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const download = async (documentItem: ChantierDocument) => {
    try {
      setDownloadingId(documentItem._id);
      const full = await chantierDocumentService.getOne(documentItem._id);
      const link = document.createElement('a');
      link.href = full.file;
      link.download = buildFileName(documentItem.name, full.mimeType);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error('Échec du téléchargement du document');
    } finally {
      setDownloadingId(null);
    }
  };

  return { download, downloadingId };
}
