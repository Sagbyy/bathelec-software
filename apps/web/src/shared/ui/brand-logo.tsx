import Image from 'next/image';
import { cn } from '@/shared/lib/utils';

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export function BrandLogo({ className, size = 50 }: BrandLogoProps) {
  return (
    <Image
      src="/logo-abrisur.webp"
      alt="Abrisûr Logo"
      width={size}
      height={size}
      className={cn('shrink-0 object-contain', className)}
      style={{ width: size, height: size }}
      priority
    />
  );
}
