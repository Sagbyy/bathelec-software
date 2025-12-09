import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useUserStore } from '@/hooks/useUserStore';
import React, { useState } from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import useAuth from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { DropdownMenuProfile } from './DropDownProfile';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { NavbarLink } from '@/types/navbar.types';

const adminLinks: NavbarLink[] = [
  {
    label: 'Utilisateurs',
    href: '#',
    type: 'folder',
    pages: [
      {
        label: 'Liste des utilisateurs',
        href: '/dashboard/admin/users',
        description: 'Voir la liste des utilisateurs',
        type: 'page',
      },
    ],
  },
  {
    label: 'Techniciens',
    href: '#',
    type: 'folder',
    pages: [
      {
        label: 'Liste des techniciens',
        href: '/dashboard/admin/technicians',
        type: 'page',
        description: 'Voir la liste des techniciens',
      },
      {
        label: 'Créez un technicien',
        href: '/dashboard/admin/technicians/new',
        type: 'page',
        description: "Création d'un nouveau compte technicien",
      },
    ],
  },
  {
    label: 'Relevés de dérivation',
    href: '#',
    type: 'folder',
    pages: [
      {
        label: 'Créez un relevé de dérivation',
        href: '/dashboard/admin/derivations/new',
        type: 'page',
        description: "Création d'un nouveau relevé de dérivation",
      },
    ],
  },
];

const technicianLinks = [
  {
    label: 'Completer un relevé de dérivation',
    href: '/dashboard/technician/derivations/complete',
    type: 'page',
    description: 'Completer un relevé de dérivation',
  },
  {
    label: 'Créez un relevé de dérivation',
    href: '/dashboard/technician/derivations/new',
    type: 'page',
    description: "Création d'un nouveau relevé de dérivation",
  },
];

const commonLinks = [
  {
    label: 'Tableau de bord',
    href: '/dashboard',
    type: 'page',
    description: 'Accéder au tableau de bord',
  },
];

export function Navbar() {
  const { user } = useUserStore();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return;

  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 shadow-sm md:px-6">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" aria-describedby={undefined}>
          <VisuallyHidden>
            <SheetTitle>Abrisûr</SheetTitle>
          </VisuallyHidden>
          <Link
            href="/dashboard"
            className="mr-6 flex"
            prefetch={false}
            onClick={() => setIsOpen(false)}
          >
            <span className="sr-only">Abrisûr Software</span>
            <AbrisurLogo />
          </Link>
          <div className="grid gap-4 py-6">
            {/* Common Links */}
            {commonLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="flex w-full items-center py-2 text-lg font-semibold"
                prefetch={false}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Admin Links with Collapsible */}
            {user?.role === 'admin' &&
              adminLinks.map((link, index) => (
                <div key={index}>
                  {link.type === 'folder' ? (
                    <Collapsible>
                      <CollapsibleTrigger className="group flex w-full items-center justify-between py-2 text-lg font-semibold">
                        <span>{link.label}</span>
                        <ChevronDown className="h-4 w-4 transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down space-y-2 overflow-hidden transition-all duration-300 ease-in-out">
                        <div className="ml-4 space-y-2 border-l pl-4">
                          {link.pages?.map((page, pageIndex) => (
                            <Link
                              key={pageIndex}
                              href={page.href}
                              className="hover:text-primary flex w-full items-center py-2 text-base"
                              prefetch={false}
                              onClick={() => setIsOpen(false)}
                            >
                              <div className="flex flex-col">
                                <p>{page.label}</p>
                                {page.description && (
                                  <span className="text-muted-foreground text-sm">
                                    {page.description}
                                  </span>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <Link
                      href={link.href}
                      className="flex w-full items-center py-2 text-lg font-semibold"
                      prefetch={false}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}

            {/* Technician Links */}
            {user?.role === 'technician' &&
              technicianLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="flex w-full items-center py-2 text-lg font-semibold"
                  prefetch={false}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

            <Button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              variant="default"
              className="mt-4 w-full"
            >
              Se déconnecter
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <Link href="/dashboard" className="mr-6 hidden lg:flex" prefetch={false}>
        <AbrisurLogo />
        <span className="sr-only">Abrisûr Software</span>
      </Link>
      <NavigationMenu className="ml-auto hidden lg:block">
        <NavigationMenuList>
          {/* Common Links */}
          {commonLinks.map((link, index) => (
            <NavigationMenuItem key={index}>
              <NavigationMenuLink asChild>
                <Link
                  href={link.href}
                  className={navigationMenuTriggerStyle()}
                  prefetch={false}
                >
                  {link.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}

          {/* Admin Links */}
          {user?.role === 'admin' &&
            adminLinks.map((link, index) => (
              <NavigationMenuItem key={index}>
                {link.type === 'folder' ? (
                  <>
                    <NavigationMenuTrigger>{link.label}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] list-none gap-3 p-4">
                        {link.pages?.map((page, index) => (
                          <ListItem
                            key={index}
                            href={page.href}
                            title={page.label}
                          >
                            {page.description && page.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink asChild>
                    <Link
                      href={link.href}
                      className={navigationMenuTriggerStyle()}
                      prefetch={false}
                    >
                      {link.label}
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}

          {/* Technician Links */}
          {user?.role === 'technician' &&
            technicianLinks.map((link, index) => (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink asChild>
                  <Link
                    href={link.href}
                    className={navigationMenuTriggerStyle()}
                    prefetch={false}
                  >
                    {link.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
        </NavigationMenuList>
      </NavigationMenu>
      <DropdownMenuProfile logout={logout} username={user?.username} />
    </header>
  );
}

function AbrisurLogo() {
  return (
    <Image
      src="/logo-abrisur.webp"
      alt="Abrisûr Logo"
      width={50}
      height={50}
      className="h-auto w-auto"
      priority
    />
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={href || '#'}
          className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors"
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
