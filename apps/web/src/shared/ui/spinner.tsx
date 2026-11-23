import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface SpinnerProps {
  className?: string;
  label?: string;
}

export function Spinner({ className, label = 'Chargement…' }: SpinnerProps) {
  return (
    <span role="status" className="inline-flex items-center">
      <Loader2 className={cn('size-6 animate-spin text-primary', className)} />
      <span className="sr-only">{label}</span>
    </span>
  );
}
