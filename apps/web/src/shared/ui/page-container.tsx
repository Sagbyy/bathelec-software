import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

type PageContainerWidth = 'narrow' | 'default' | 'wide' | 'full';

const WIDTH_CLASSES: Record<PageContainerWidth, string> = {
  narrow: 'max-w-2xl',
  default: 'max-w-5xl',
  wide: 'max-w-7xl',
  full: 'max-w-none',
};

interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  width?: PageContainerWidth;
}

export function PageContainer({
  width = 'wide',
  className,
  ...props
}: PageContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 py-6 animate-fade-in-up sm:px-6 md:py-8 lg:px-8',
        WIDTH_CLASSES[width],
        className
      )}
      {...props}
    />
  );
}
