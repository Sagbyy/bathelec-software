import Image from 'next/image';
import { cn } from '@/shared/lib/utils';

interface BrandMarkProps {
  className?: string;
}

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
      className={cn('size-8 shrink-0', className)}
    >
      <circle
        cx="20"
        cy="20"
        r="17.5"
        fill="none"
        stroke="rgb(var(--primary))"
        strokeWidth="3"
      />
      <circle cx="24" cy="15.5" r="7.5" fill="rgb(var(--primary))" />
    </svg>
  );
}

interface BrandLogoProps {
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
  caption?: string;
}

export function BrandLogo({
  className,
  markClassName,
  showWordmark = true,
  caption,
}: BrandLogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <BrandMark className={markClassName} />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold uppercase tracking-[0.18em] text-foreground">
            Abrisûr
          </span>
          {caption && (
            <span className="mt-1 text-[11px] font-medium text-muted-foreground">
              {caption}
            </span>
          )}
        </span>
      )}
    </span>
  );
}

interface BrandLogoImageProps {
  className?: string;
  size?: number;
}

export function BrandLogoImage({ className, size = 120 }: BrandLogoImageProps) {
  return (
    <Image
      src="/logo-abrisur.webp"
      alt="Abrisûr"
      width={size}
      height={size}
      className={cn('h-auto', className)}
      priority
    />
  );
}
