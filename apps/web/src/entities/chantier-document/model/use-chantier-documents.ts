'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChantierDocument } from '@repo/types';
import {
  chantierDocumentService,
  UploadChantierDocumentDto,
} from '../api/chantier-document.service';

export const chantierDocumentsKey = (chantierId: number) =>
  ['chantier-documents', chantierId] as const;

export const useChantierDocuments = (chantierId: number) =>
  useQuery<ChantierDocument[]>({
    queryKey: chantierDocumentsKey(chantierId),
    queryFn: () => chantierDocumentService.getByChantier(chantierId),
    enabled: Number.isFinite(chantierId),
  });

export const useUploadChantierDocument = (chantierId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UploadChantierDocumentDto) =>
      chantierDocumentService.upload(chantierId, dto),
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
