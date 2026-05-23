'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { specialHabilitationService } from '../api/special-habilitation.service';
import { UpdateSpecialHabilitationDto } from './special-habilitation.types';

export const SPECIAL_HABILITATION_QUERY_KEY = 'special-habilitation';

export const useSpecialHabilitation = (userId: number) => {
  return useQuery({
    queryKey: [SPECIAL_HABILITATION_QUERY_KEY, userId],
    queryFn: () => specialHabilitationService.getByUserId(userId),
    enabled: !!userId,
    retry: false,
  });
};

export const useUpdateSpecialHabilitation = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateSpecialHabilitationDto) =>
      specialHabilitationService.upsert(userId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [SPECIAL_HABILITATION_QUERY_KEY, userId],
      });
    },
  });
};
