import { completedDerivationsService } from '@/services/completed-derivations.service';
import { CreateCompletedDerivation } from '@/types/completed-derivation.types';
import { CompletedDerivation } from '@repo/types';
import {
  useMutation,
  UseMutationResult,
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
