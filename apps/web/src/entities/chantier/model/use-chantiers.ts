'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Chantier } from '@repo/types';
import {
  chantierService,
  CreateChantierDto,
  UpdateChantierScheduleDto,
} from '../api/chantier.service';

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

export const useScheduledChantiers = () =>
  useQuery<Chantier[]>({
    queryKey: ['chantiers', 'scheduled'],
    queryFn: () => chantierService.getScheduled(),
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

export const useUpdateChantierSchedule = (chantierId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateChantierScheduleDto) =>
      chantierService.updateSchedule(chantierId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chantiers'] });
    },
  });
};
