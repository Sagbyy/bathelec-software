import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { derivationService } from '@/services/derivation.service';
import { Derivation } from '@repo/types';

export const useDerivationByUser = (userId: number) => {
  const { data, isLoading, error } = useQuery<Derivation[]>({
    queryKey: ['derivations', userId],
    queryFn: () => derivationService.getDerivationsByUser(userId),
  });

  return { data, isLoading, error };
};

export const useDerivationById = (derivationId: number) => {
  const { data, isLoading, error } = useQuery<Derivation>({
    queryKey: ['derivation', derivationId],
    queryFn: () => derivationService.getDerivationById(derivationId),
  });

  return { data, isLoading, error };
};

export const useDerivation = () => {
  const { data, isLoading, error } = useQuery<Derivation[]>({
    queryKey: ['derivations'],
    queryFn: () => derivationService.getDerivations(),
  });

  return { data, isLoading, error };
};
