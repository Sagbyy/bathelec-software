'use client';

import Image from 'next/image';
import Link from 'next/link';
import { User } from 'lucide-react';
import { useUserStore } from '@/entities/user';
import { cn } from '@/shared/lib/utils';

type NavItem = {
  label: string;
  href: string;
  imageSrc: string;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Top Chantiers',
    href: '/dashboard/technician/top-chantiers',
    imageSrc: '/images/red-folder.png',
  },
  {
    label: 'Chantiers en cours',
    href: '/dashboard/technician/derivations',
    imageSrc: '/images/red-folder.png',
  },
  {
    label: 'Chantiers terminés',
    href: '/dashboard/technician/derivations/complete',
    imageSrc: '/images/green-folder.png',
  },
  {
    label: 'Mes documents officiels',
    href: '/dashboard/technician/documents',
    imageSrc: '/images/red-folder.png',
  },
  {
    label: 'Mes habilitations',
    href: '/dashboard/technician/habilitations',
    imageSrc: '/images/red-folder.png',
  },
  {
    label: 'Mon véhicule',
    href: '/dashboard/technician/vehicule',
    imageSrc: '/images/red-folder.png',
  },
  {
    label: "Numéros d'urgence",
    href: '/dashboard/technician/urgences',
    imageSrc: '/images/red-folder.png',
  },
];

export function TechnicianHome() {
  const { user } = useUserStore();

  const fullName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : (user?.firstName ?? user?.lastName ?? 'Technicien');

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="mx-auto w-full max-w-5xl px-4 pb-8 pt-6 md:px-8 md:pt-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">
              Tableau de bord
            </p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">
              Bonjour, {fullName} 👋
            </h1>
            <p className="mt-1 text-gray-500">Que souhaitez-vous faire ?</p>
          </div>
          <Link
            href="/dashboard/profile"
            className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm transition-all duration-150 hover:shadow-md active:scale-95"
          >
            <User className="h-4 w-4 text-slate-600" strokeWidth={1.75} />
            <span className="text-sm font-medium text-gray-900">
              Mon profil
            </span>
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 pb-8 md:px-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="col-span-2">
            <NavCard item={NAV_ITEMS[0]!} fullWidth />
          </div>
          {NAV_ITEMS.slice(1).map((item) => (
            <NavCard key={item.href} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function NavCard({
  item,
  fullWidth = false,
}: {
  item: NavItem;
  fullWidth?: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        'group flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200',
        'hover:-translate-y-0.5 hover:shadow-md active:scale-95',
        fullWidth
          ? 'flex-row gap-4 py-5'
          : 'min-h-[120px] gap-3 sm:min-h-[140px]'
      )}
    >
      <Image
        src={item.imageSrc}
        alt={item.label}
        width={fullWidth ? 48 : 64}
        height={fullWidth ? 48 : 64}
        className="shrink-0 object-contain"
      />
      <span
        className={cn(
          'font-semibold leading-tight text-gray-700',
          fullWidth
            ? 'text-base md:text-lg'
            : 'text-center text-sm sm:text-base'
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}
