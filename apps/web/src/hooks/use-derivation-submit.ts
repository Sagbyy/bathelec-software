'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CreateCompletedDerivation } from '@/types/completed-derivation.types';
import { useCompletedDerivations } from '@/hooks/queries/use-completed-derivations';

export function useDerivationSubmit(derivationId: number) {
  const router = useRouter();
  const { mutate, status, error } = useCompletedDerivations();

  useEffect(() => {
    if (status === 'success') {
      toast.success('Formulaire soumis avec succès !');
      router.push(`/dashboard/technician/derivations/complete/${derivationId}`);
    }
    if (status === 'error') {
      toast.error(
        `Une erreur est survenue lors de la soumission du formulaire. ${error?.message}`
      );
    }
  }, [status, error, router]);

  const submit = useCallback(
    (data: CreateCompletedDerivation) => {
      mutate({ ...data, requestedDerivationId: derivationId });
    },
    [mutate, derivationId]
  );

  return { submit };
}
