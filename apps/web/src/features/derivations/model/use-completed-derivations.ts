import {
  completedDerivationsService,
  type CreateCompletedDerivation,
} from '@/entities/derivation';
import { CompletedDerivation } from '@repo/types';
import {
  useMutation,
  UseMutationResult,
  useQueries,
  useQuery,
} from '@tanstack/react-query';

export const useCompletedDerivations = (): UseMutationResult<
  CreateCompletedDerivation,
  Error,
  CreateCompletedDerivation
> => {
  return useMutation<
    CreateCompletedDerivation,
    Error,
    CreateCompletedDerivation
  >({
    mutationFn: (completedDerivation: CreateCompletedDerivation) =>
      completedDerivationsService.createCompletedDerivation(
        completedDerivation
      ),
    onSuccess: (data) => {
      console.log('Completed derivation created successfully with data:', data);
    },
    onError: (error) => {
      console.error('Error creating completed derivation', error);
    },
  });
};

export const useCompletedDerivationsById = (derivationId: number) => {
  const { data, isLoading, error } = useQuery<CompletedDerivation>({
    queryKey: ['completed-derivations', derivationId],
    queryFn: () =>
      completedDerivationsService.getCompletedDerivationsById(derivationId),
  });

  return { data, isLoading, error };
};

export const useCompletedDerivationsByIds = (derivationIds: number[]) => {
  const results = useQueries({
    queries: derivationIds.map((id) => ({
      queryKey: ['completed-derivations', id],
      queryFn: () =>
        completedDerivationsService.getCompletedDerivationsById(id),
    })),
  });

  const byId = new Map<number, CompletedDerivation | undefined>();
  derivationIds.forEach((id, index) => {
    byId.set(id, results[index]?.data as CompletedDerivation | undefined);
  });

  return {
    byId,
    isLoading: results.some((r) => r.isLoading),
  };
};
