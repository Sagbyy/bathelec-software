'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { officialDocumentService } from '../api/official-document.service';
import { CreateOfficialDocumentDto } from './official-document.types';

export const OFFICIAL_DOCUMENT_QUERY_KEY = 'official-document';

export const useOfficialDocument = (userId: number) => {
  return useQuery({
    queryKey: [OFFICIAL_DOCUMENT_QUERY_KEY, userId],
    queryFn: () => officialDocumentService.getByUserId(userId),
    enabled: !!userId,
    retry: false,
  });
};

export const useUpsertOfficialDocument = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateOfficialDocumentDto) =>
      officialDocumentService.createOrUpdate(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [OFFICIAL_DOCUMENT_QUERY_KEY, userId],
      });
    },
  });
};
