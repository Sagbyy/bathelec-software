'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronRight, UserRound } from 'lucide-react';
import { useUserStore } from '@/entities/user';
import { Button } from '@/shared/ui/button';
import { GridBackdrop } from '@/shared/ui/grid-backdrop';
import { PageContainer } from '@/shared/ui/page-container';
import {
  FEATURED_ITEM,
  NAV_SECTIONS,
  type TechnicianNavItem,
} from '../config/nav-items';

export function TechnicianHome() {
  const { user } = useUserStore();

  const fullName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : (user?.firstName ?? user?.lastName ?? 'Technicien');

  return (
    <PageContainer width="default" className="space-y-8">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Tableau de bord
          </p>
          <h1 className="mt-1 truncate text-2xl font-semibold tracking-tight md:text-3xl">
            Bonjour, {fullName} 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            Que souhaitez-vous faire ?
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="size-10 shrink-0 px-0 sm:h-10 sm:w-auto sm:px-4"
        >
          <Link href="/dashboard/profile">
            <UserRound />
            <span className="sr-only sm:not-sr-only">Mon profil</span>
          </Link>
        </Button>
      </header>

      <FeaturedCard item={FEATURED_ITEM} />

      {NAV_SECTIONS.map((section) => (
        <section key={section.title} aria-labelledby={sectionId(section.title)}>
          <h2
            id={sectionId(section.title)}
            className="mb-3 text-sm font-semibold text-muted-foreground"
          >
            {section.title}
          </h2>
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {section.items.map((item) => (
              <li key={item.href}>
                <NavCard item={item} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </PageContainer>
  );
}

const sectionId = (title: string) =>
  `section-${title.toLowerCase().replace(/\s+/g, '-')}`;

function FeaturedCard({ item }: { item: TechnicianNavItem }) {
  return (
    <Link
      href={item.href}
      className="group relative flex items-center gap-4 overflow-hidden rounded-2xl bg-ink p-5 text-white shadow-elevated transition-transform active:scale-[0.99] sm:p-6"
    >
      <GridBackdrop cellSize={24} />
      <span className="relative flex size-14 shrink-0 items-center justify-center rounded-xl bg-white shadow-elevated">
        <Image
          src={item.imageSrc}
          alt=""
          width={40}
          height={40}
          className="object-contain"
        />
      </span>
      <span className="relative min-w-0 flex-1">
        <span className="block text-lg font-semibold">{item.label}</span>
        {item.description && (
          <span className="block text-sm text-white/70">
            {item.description}
          </span>
        )}
      </span>
      <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-transform group-hover:translate-x-0.5">
        <ArrowRight className="size-4" />
      </span>
    </Link>
  );
}

function NavCard({ item }: { item: TechnicianNavItem }) {
  return (
    <Link
      href={item.href}
      className="group flex h-full flex-col gap-3 rounded-xl border bg-card p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elevated active:scale-[0.98]"
    >
      <span className="flex items-start justify-between">
        <span className="flex size-12 items-center justify-center rounded-xl bg-muted transition-colors group-hover:bg-primary-soft">
          <Image
            src={item.imageSrc}
            alt=""
            width={32}
            height={32}
            className="object-contain"
          />
        </span>
        <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
      </span>
      <span>
        <span className="block text-sm font-semibold leading-tight sm:text-base">
          {item.label}
        </span>
        {item.description && (
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {item.description}
          </span>
        )}
      </span>
    </Link>
  );
}
