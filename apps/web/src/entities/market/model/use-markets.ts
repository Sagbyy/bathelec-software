'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Market } from '@repo/types';
import {
  CreateMarketDto,
  marketService,
} from '@/entities/market/api/market.service';

export const useMarkets = () =>
  useQuery<Market[]>({
    queryKey: ['markets'],
    queryFn: () => marketService.getAll(),
  });

export const useCreateMarket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateMarketDto) => marketService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['markets'] });
    },
  });
};
