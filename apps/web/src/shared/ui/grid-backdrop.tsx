import { cn } from '@/shared/lib/utils';

interface GridBackdropProps {
  className?: string;
  cellSize?: number;
}

export function GridBackdrop({ className, cellSize = 32 }: GridBackdropProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0', className)}
    >
      <div
        className="absolute inset-0 opacity-[0.08] [mask-image:linear-gradient(to_bottom_left,black,transparent_70%)]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: `${cellSize}px ${cellSize}px`,
        }}
      />
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary via-primary/60 to-transparent" />
      <div className="absolute -right-1/4 top-0 h-full w-2/3 bg-gradient-to-l from-primary/25 to-transparent" />
    </div>
  );
}
