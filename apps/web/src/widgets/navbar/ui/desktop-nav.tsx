'use client';

import Link from 'next/link';
import { NavbarLink } from '@/entities/user';
import { cn } from '@/shared/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/shared/ui/navigation-menu';
import { isLinkActive } from '../lib/navbar-links';

interface DesktopNavProps {
  links: NavbarLink[];
  pathname: string;
  activeHref?: string;
}

export function DesktopNav({ links, pathname, activeHref }: DesktopNavProps) {
  return (
    <NavigationMenu viewport={false} className="hidden lg:flex">
      <NavigationMenuList>
        {links.map((link) => {
          const active = isLinkActive(pathname, link);
          return (
            <NavigationMenuItem key={link.label}>
              {link.type === 'folder' ? (
                <>
                  <NavigationMenuTrigger data-active={active || undefined}>
                    {link.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="left-auto right-0">
                    <ul className="grid w-[360px] list-none gap-1 p-2">
                      {link.pages?.map((page) => (
                        <li key={page.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={page.href}
                              aria-current={
                                activeHref === page.href ? 'page' : undefined
                              }
                              className={cn(
                                'block select-none rounded-lg p-3 outline-none transition-colors hover:bg-accent focus:bg-accent',
                                activeHref === page.href && 'bg-primary-soft'
                              )}
                            >
                              <div
                                className={cn(
                                  'text-sm font-medium',
                                  activeHref === page.href &&
                                    'text-primary-soft-foreground'
                                )}
                              >
                                {page.label}
                              </div>
                              {page.description && (
                                <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground">
                                  {page.description}
                                </p>
                              )}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink asChild active={active}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={navigationMenuTriggerStyle()}
                  >
                    {link.label}
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
