'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { getActiveTabHref, HOME_HREF } from '../lib/tab-links';
import { TechnicianTabBar } from './technician-tab-bar';
import { TechnicianTopbar } from './technician-topbar';

export function TechnicianShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? HOME_HREF;

  return (
    <div className="flex min-h-dvh flex-col">
      <TechnicianTopbar showBack={pathname !== HOME_HREF} />
      <div className="flex-1 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
        {children}
      </div>
      <TechnicianTabBar activeHref={getActiveTabHref(pathname)} />
    </div>
  );
}
