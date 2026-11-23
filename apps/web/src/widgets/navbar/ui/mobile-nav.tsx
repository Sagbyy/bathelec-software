'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { NavbarLink } from '@/entities/user';
import { cn } from '@/shared/lib/utils';
import { BrandLogo } from '@/shared/ui/brand-logo';
import { Button } from '@/shared/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet';

interface MobileNavProps {
  links: NavbarLink[];
  activeHref?: string;
}

export function MobileNav({ links, activeHref }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="-ml-2 lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="!size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex w-[85%] max-w-xs flex-col gap-0 overflow-y-auto overscroll-contain p-0"
      >
        <div className="flex h-16 shrink-0 items-center border-b px-5">
          <SheetTitle asChild>
            <Link href="/dashboard" onClick={close} aria-label="Abrisûr">
              <BrandLogo size={44} />
            </Link>
          </SheetTitle>
          <SheetDescription className="sr-only">
            Navigation principale
          </SheetDescription>
        </div>
        <nav className="flex flex-col gap-6 px-3 py-5">
          {links.map((link) =>
            link.type === 'folder' ? (
              <div key={link.label}>
                <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {link.label}
                </p>
                <ul className="flex flex-col gap-0.5">
                  {link.pages?.map((page) => (
                    <li key={page.href}>
                      <MobileNavItem
                        link={page}
                        active={activeHref === page.href}
                        onNavigate={close}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <MobileNavItem
                key={link.href}
                link={link}
                active={activeHref === link.href}
                onNavigate={close}
              />
            )
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

interface MobileNavItemProps {
  link: NavbarLink;
  active: boolean;
  onNavigate: () => void;
}

function MobileNavItem({ link, active, onNavigate }: MobileNavItemProps) {
  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex min-h-11 items-center rounded-lg px-3 text-[15px] font-medium transition-colors',
        active
          ? 'bg-primary-soft text-primary-soft-foreground'
          : 'text-foreground/80 hover:bg-accent hover:text-foreground'
      )}
    >
      {link.label}
    </Link>
  );
}
