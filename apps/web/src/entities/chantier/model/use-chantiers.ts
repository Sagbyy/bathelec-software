'use client';

import { useQuery } from '@tanstack/react-query';
import { Chantier } from '@repo/types';
import { chantierService } from '../api/chantier.service';

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
