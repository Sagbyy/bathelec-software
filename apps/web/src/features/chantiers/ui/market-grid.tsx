'use client';

import Link from 'next/link';
import { Folder } from 'lucide-react';
import { Chantier } from '@repo/types';
import { groupByMarket } from '../lib/group-by-market';

interface MarketGridProps {
  chantiers: Chantier[];
  basePath: string;
  emptyMessage?: string;
}

export function MarketGrid({
  chantiers,
  basePath,
  emptyMessage = 'Aucun marché.',
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
          className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500 transition-colors group-hover:bg-blue-600">
            <Folder className="h-10 w-10 text-white" strokeWidth={1.75} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold text-blue-700">
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
