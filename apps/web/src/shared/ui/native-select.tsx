import * as React from 'react';
import { cn } from '@/shared/lib/utils';

export const NativeSelect = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'h-10 w-full rounded-lg border border-input bg-card px-3 text-base shadow-xs transition-[color,box-shadow,border-color] hover:border-foreground/20 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/15 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 md:text-sm',
      className
    )}
    {...props}
  />
));
NativeSelect.displayName = 'NativeSelect';
