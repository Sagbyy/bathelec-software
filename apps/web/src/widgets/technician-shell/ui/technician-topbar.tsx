'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { UserMenu } from '@/features/auth';
import { ReportSyncStatus } from '@/features/derivations';
import { ThemeToggle } from '@/features/theme-toggle';
import { BrandLogo } from '@/shared/ui/brand-logo';
import { Button } from '@/shared/ui/button';
import { OFFLINE_SHELL_PATHS } from '../lib/tab-links';

interface TechnicianTopbarProps {
  showBack: boolean;
}

export function TechnicianTopbar({ showBack }: TechnicianTopbarProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-1 px-2 sm:h-16 sm:px-6">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            aria-label="Retour"
          >
            <ArrowLeft className="!size-5" />
          </Button>
        )}
        <Link
          href="/dashboard"
          aria-label="Retour au tableau de bord"
          className="rounded-lg px-2 py-1"
        >
          <BrandLogo size={44} />
        </Link>
        <div className="ml-auto flex items-center gap-1">
          <ReportSyncStatus shellPaths={OFFLINE_SHELL_PATHS} />
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
