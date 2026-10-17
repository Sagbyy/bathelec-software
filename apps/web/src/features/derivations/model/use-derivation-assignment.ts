import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  derivationQueries,
  derivationService,
  type CreateDerivation,
} from '@/entities/derivation';

const useInvalidateDerivations = () => {
  const queryClient = useQueryClient();
  return (derivationId?: number) => {
    queryClient.invalidateQueries({ queryKey: ['derivations'] });
    if (derivationId !== undefined) {
      queryClient.invalidateQueries({
        queryKey: ['derivation', derivationId],
      });
    }
  };
};

export const useMyDerivations = () => useQuery(derivationQueries.mine());

export const useCreateDerivation = () => {
  const invalidate = useInvalidateDerivations();

  return useMutation({
    mutationFn: (createDerivation: CreateDerivation) =>
      derivationService.createDerivation(createDerivation),
    onSuccess: () => {
      invalidate();
      toast.success('Dérivation créée avec succès');
    },
    onError: () => {
      toast.error("La dérivation n'a pas pu être créée");
    },
  });
};

export const useAssignDerivationTeam = (derivationId: number) => {
  const invalidate = useInvalidateDerivations();

  return useMutation({
    mutationFn: (teamId: number) =>
      derivationService.assignTeam(derivationId, teamId),
    onSuccess: () => {
      invalidate(derivationId);
      toast.success('Équipe chantier mise à jour');
    },
    onError: () => {
      toast.error("L'équipe chantier n'a pas pu être modifiée");
    },
  });
};

export const useAssignDerivationUser = () => {
  const invalidate = useInvalidateDerivations();

  return useMutation({
    mutationFn: ({
      derivationId,
      userId,
    }: {
      derivationId: number;
      userId: number | null;
    }) => derivationService.assignUser(derivationId, userId),
    onSuccess: (_data, { derivationId }) => {
      invalidate(derivationId);
      toast.success('Attribution mise à jour');
    },
    onError: () => {
      toast.error("L'attribution n'a pas pu être modifiée");
    },
  });
};

export const useClaimDerivation = () => {
  const invalidate = useInvalidateDerivations();

  return useMutation({
    mutationFn: (derivationId: number) =>
      derivationService.claimDerivation(derivationId),
    onSuccess: (_data, derivationId) => {
      invalidate(derivationId);
      toast.success('Dérivation attribuée');
    },
    onError: () => {
      invalidate();
      toast.error('Impossible de vous attribuer cette dérivation');
    },
  });
};
