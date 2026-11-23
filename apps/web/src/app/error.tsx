'use client';
import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
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
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-primary-soft text-primary">
        <AlertTriangle className="size-6" />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight">
        Une erreur est survenue
      </h2>
      <p className="max-w-sm text-muted-foreground">
        Veuillez réessayer ou contacter le support si le problème persiste.
      </p>
      <Button onClick={reset}>Réessayer</Button>
    </div>
  );
}
