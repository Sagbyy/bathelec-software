import { derivationService } from '@/services/derivation.service';
import { UpdateDerivation } from '@/types/update-derivation.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdateCommentDerivation = (derivationId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateDerivation: UpdateDerivation) =>
      derivationService.updateCommentDerivation(derivationId, updateDerivation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['derivation', derivationId] });
      toast.success('Commentaire mis à jour avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour du commentaire');
    },
  });
};
