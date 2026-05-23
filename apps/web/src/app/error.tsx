'use client';
import { useEffect } from 'react';
import { Button } from '@/shared/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-semibold">Une erreur est survenue</h2>
      <p className="text-muted-foreground">
        Veuillez réessayer ou contacter le support.
      </p>
      <Button onClick={reset}>Réessayer</Button>
    </div>
  );
}
