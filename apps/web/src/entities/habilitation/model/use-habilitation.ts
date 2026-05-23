'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { habilitationService } from '../api/habilitation.service';
import { UpdateHabilitationDto } from './habilitation.types';

export const HABILITATION_QUERY_KEY = 'habilitation';

export const useHabilitation = (userId: number) => {
  return useQuery({
    queryKey: [HABILITATION_QUERY_KEY, userId],
    queryFn: () => habilitationService.getByUserId(userId),
    enabled: !!userId,
    retry: false,
  });
};

export const useUpdateHabilitation = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateHabilitationDto) =>
      habilitationService.upsert(userId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [HABILITATION_QUERY_KEY, userId],
      });
    },
  });
};
