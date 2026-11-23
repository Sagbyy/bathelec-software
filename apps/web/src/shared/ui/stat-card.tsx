import type { ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import type { Tone } from '@/shared/lib/tone';
import { cn } from '@/shared/lib/utils';

const iconToneVariants = cva(
  'flex size-9 shrink-0 items-center justify-center rounded-lg [&_svg]:size-[18px]',
  {
    variants: {
      tone: {
        brand: 'bg-primary-soft text-primary',
        success: 'bg-success-soft text-success-soft-foreground',
        warning: 'bg-warning-soft text-warning-soft-foreground',
        info: 'bg-info-soft text-info-soft-foreground',
        neutral: 'bg-muted text-muted-foreground',
      },
    },
    defaultVariants: { tone: 'neutral' },
  }
);

interface StatCardProps {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  tone?: Tone;
  className?: string;
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-xl border bg-card p-4 text-card-foreground shadow-card sm:p-5',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon && <div className={iconToneVariants({ tone })}>{icon}</div>}
      </div>
      <p className="text-3xl font-semibold tabular-nums tracking-tight">
        {value}
      </p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
