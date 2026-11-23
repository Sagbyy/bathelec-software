import { cn } from '@/shared/lib/utils';
import { BrandLogo } from './brand-logo';
import { Spinner } from './spinner';

interface PageLoaderProps {
  inline?: boolean;
}

export function PageLoader({ inline = false }: PageLoaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-6 bg-background px-6 text-center',
        inline ? 'min-h-[60dvh]' : 'min-h-dvh'
      )}
    >
      <BrandLogo size={160} />
      <div className="space-y-1">
        <p className="text-base font-semibold text-foreground">
          Chargement en cours…
        </p>
        <p className="text-sm text-muted-foreground">
          Nous préparons votre espace
        </p>
      </div>
      <Spinner />
    </div>
  );
}
