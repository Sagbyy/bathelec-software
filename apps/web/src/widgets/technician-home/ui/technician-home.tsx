'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Trophy,
  FileText,
  ShieldCheck,
  Car,
  PhoneCall,
  User,
} from 'lucide-react';
import { type LucideIcon } from 'lucide-react';
import { useUserStore } from '@/entities/user';
import { cn } from '@/shared/lib/utils';

type NavItemIcon = {
  label: string;
  href: string;
  icon: LucideIcon;
  imageSrc?: never;
  color: string;
  textColor: string;
  bgLight: string;
  border: string;
};

type NavItemImage = {
  label: string;
  href: string;
  icon?: never;
  imageSrc: string;
  color?: never;
  textColor: string;
  bgLight: string;
  border: string;
};

type NavItem = NavItemIcon | NavItemImage;

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Top Chantiers',
    href: '/dashboard/technician/top-chantiers',
    icon: Trophy,
    color: 'bg-amber-500',
    textColor: 'text-amber-600',
    bgLight: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    label: 'Chantiers en cours',
    href: '/dashboard/technician/derivations',
    imageSrc: '/images/red-folder.png',
    textColor: 'text-gray-700',
    bgLight: 'bg-white',
    border: 'border-gray-200',
  },
  {
    label: 'Chantiers terminés',
    href: '/dashboard/technician/derivations/complete',
    imageSrc: '/images/green-folder.png',
    textColor: 'text-gray-700',
    bgLight: 'bg-white',
    border: 'border-gray-200',
  },
  {
    label: 'Mes documents officiels',
    href: '/dashboard/technician/documents',
    icon: FileText,
    color: 'bg-purple-500',
    textColor: 'text-purple-600',
    bgLight: 'bg-purple-50',
    border: 'border-purple-200',
  },
  {
    label: 'Mes habilitations',
    href: '/dashboard/technician/habilitations',
    icon: ShieldCheck,
    color: 'bg-indigo-500',
    textColor: 'text-indigo-600',
    bgLight: 'bg-indigo-50',
    border: 'border-indigo-200',
  },
  {
    label: 'Mon véhicule',
    href: '/dashboard/technician/vehicule',
    icon: Car,
    color: 'bg-slate-500',
    textColor: 'text-slate-600',
    bgLight: 'bg-slate-50',
    border: 'border-slate-200',
  },
  {
    label: "Numéros d'urgence",
    href: '/dashboard/technician/urgences',
    icon: PhoneCall,
    color: 'bg-red-500',
    textColor: 'text-red-600',
    bgLight: 'bg-red-50',
    border: 'border-red-200',
  },
];

export function TechnicianHome() {
  const { user } = useUserStore();

  const firstName = user?.username ?? 'Technicien';

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="mx-auto w-full max-w-5xl px-4 pb-8 pt-6 md:px-8 md:pt-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">
              Tableau de bord
            </p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">
              Bonjour, {firstName} 👋
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
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {NAV_ITEMS.slice(0, 6).map((item) => (
            <NavCard key={item.href} item={item} />
          ))}

          {/* Numéros d'urgence — pleine largeur en bas */}
          <div className="col-span-2 md:col-span-3 lg:col-span-4">
            <NavCard item={NAV_ITEMS[6]!} fullWidth />
          </div>
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
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        'group flex flex-col items-center justify-center rounded-2xl border p-4 shadow-sm transition-all duration-200',
        'hover:-translate-y-0.5 hover:shadow-md active:scale-95',
        item.bgLight,
        item.border,
        fullWidth
          ? 'flex-row gap-4 py-5'
          : 'min-h-[120px] gap-3 sm:min-h-[140px]'
      )}
    >
      {item.imageSrc ? (
        <Image
          src={item.imageSrc}
          alt={item.label}
          width={fullWidth ? 48 : 64}
          height={fullWidth ? 48 : 64}
          className="shrink-0 object-contain"
        />
      ) : (
        <div
          className={cn(
            'flex shrink-0 items-center justify-center rounded-xl',
            item.color,
            fullWidth ? 'h-12 w-12' : 'h-14 w-14 sm:h-16 sm:w-16'
          )}
        >
          {Icon && (
            <Icon
              className={cn(
                'text-white',
                fullWidth ? 'h-6 w-6' : 'h-7 w-7 sm:h-8 sm:w-8'
              )}
              strokeWidth={1.75}
            />
          )}
        </div>
      )}
      <span
        className={cn(
          'font-semibold leading-tight',
          item.textColor,
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
