'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Chantier } from '@repo/types';
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
    return (
      <p className="text-muted-foreground py-10 text-center text-sm">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {markets.map((market) => (
        <Link
          key={market.marketId}
          href={`${basePath}/markets/${market.marketId}`}
          className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
        >
          <Image
            src={folderImageSrc}
            alt=""
            width={80}
            height={80}
            className="object-contain"
          />
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold text-gray-800">
              {market.marketName}
            </span>
            <span className="text-muted-foreground text-sm">
              {market.chantiers.length} chantier
              {market.chantiers.length > 1 ? 's' : ''}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
