'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Chantier } from '@repo/types';
import { chantierService, CreateChantierDto } from '../api/chantier.service';

export const useChantiers = () =>
  useQuery<Chantier[]>({
    queryKey: ['chantiers'],
    queryFn: () => chantierService.getAll(),
  });

export const useOngoingChantiers = () =>
  useQuery<Chantier[]>({
    queryKey: ['chantiers', 'ongoing'],
    queryFn: () => chantierService.getOngoing(),
  });

export const useFinishedChantiers = () =>
  useQuery<Chantier[]>({
    queryKey: ['chantiers', 'finished'],
    queryFn: () => chantierService.getFinished(),
  });

export const useCreateChantier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateChantierDto) => chantierService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chantiers'] });
      queryClient.invalidateQueries({ queryKey: ['markets'] });
    },
  });
};
