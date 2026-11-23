import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { BrandMark } from '@/shared/ui/brand-logo';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center">
      <BrandMark className="mb-8 size-16" />
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">
        Erreur 404
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        Page introuvable
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        La page que vous cherchez n'existe pas ou a été déplacée. Vérifiez
        l'adresse ou revenez à l'accueil.
      </p>
      <div className="mt-8 flex w-full max-w-xs flex-col gap-2 sm:max-w-none sm:flex-row sm:justify-center">
        <Button asChild>
          <Link href="/dashboard">Retour à l'accueil</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/auth">Se connecter</Link>
        </Button>
      </div>
    </div>
  );
}
