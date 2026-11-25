import { useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DerivationStatus, type Derivation } from '@repo/types';
import { derivationService } from '@/entities/derivation';

export const shouldStartDerivation = (
  derivation: Pick<Derivation, 'status'>,
  isFormDisabled: boolean
) => !isFormDisabled && derivation.status === DerivationStatus.PENDING;

export const useStartDerivation = (
  derivation: Pick<Derivation, 'id' | 'status'>,
  isFormDisabled: boolean
) => {
  const queryClient = useQueryClient();
  const startedFor = useRef<number | null>(null);
  const { mutate } = useMutation({
    mutationFn: (derivationId: number) =>
      derivationService.startDerivation(derivationId),
    onSuccess: (_data, derivationId) => {
      queryClient.invalidateQueries({ queryKey: ['derivations'] });
      queryClient.invalidateQueries({
        queryKey: ['derivation', derivationId],
      });
    },
  });

  useEffect(() => {
    if (
      !shouldStartDerivation(derivation, isFormDisabled) ||
      startedFor.current === derivation.id
    ) {
      return;
    }

    startedFor.current = derivation.id;
    mutate(derivation.id);
  }, [derivation, isFormDisabled, mutate]);
};
