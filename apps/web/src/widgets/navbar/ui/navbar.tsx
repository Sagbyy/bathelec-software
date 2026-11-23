'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/entities/user';
import { UserMenu } from '@/features/auth';
import { ThemeToggle } from '@/features/theme-toggle';
import { BrandLogo } from '@/shared/ui/brand-logo';
import { getActiveHref, getNavigationLinks } from '../lib/navbar-links';
import { DesktopNav } from './desktop-nav';
import { MobileNav } from './mobile-nav';

export function Navbar() {
  const { user } = useUserStore();
  const pathname = usePathname() ?? '';

  if (!user) return null;

  const links = getNavigationLinks(user.role);
  const activeHref = getActiveHref(pathname, links);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-2 px-4 sm:px-6 lg:gap-6 lg:px-8">
        <MobileNav links={links} activeHref={activeHref} />
        <Link
          href="/dashboard"
          aria-label="Abrisûr, retour au tableau de bord"
          className="rounded-lg"
        >
          <BrandLogo caption="Gestion des chantiers" />
        </Link>
        <div className="ml-auto flex items-center gap-1 lg:gap-2">
          <DesktopNav
            links={links}
            pathname={pathname}
            activeHref={activeHref}
          />
          <div className="mx-1 hidden h-6 w-px bg-border lg:block" />
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
