'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Chantier } from '@repo/types';
import { FolderOpen } from 'lucide-react';
import { EmptyState } from '@/shared/ui/empty-state';
import { groupByMarket } from '../lib/group-by-market';

interface MarketGridProps {
  chantiers: Chantier[];
  basePath: string;
  emptyMessage?: string;
  folderImageSrc: string;
}

export function MarketGrid({
  chantiers,
  basePath,
  emptyMessage = 'Aucun marché.',
  folderImageSrc,
}: MarketGridProps) {
  const markets = groupByMarket(chantiers);

  if (markets.length === 0) {
    return <EmptyState icon={<FolderOpen />} title={emptyMessage} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {markets.map((market) => (
        <Link
          key={market.marketId}
          href={`${basePath}/markets/${market.marketId}`}
          className="bg-card shadow-card hover:border-primary/30 hover:shadow-elevated group flex flex-col items-center justify-center gap-3 rounded-xl border p-6 text-center transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <Image
            src={folderImageSrc}
            alt=""
            width={80}
            height={80}
            className="object-contain"
          />
          <div className="flex flex-col gap-1">
            <span className="text-foreground text-lg font-semibold">
              {market.marketName}
            </span>
            <span className="bg-muted text-muted-foreground inline-flex self-center rounded-full px-2.5 py-0.5 text-xs font-medium">
              {market.chantiers.length} chantier
              {market.chantiers.length > 1 ? 's' : ''}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
