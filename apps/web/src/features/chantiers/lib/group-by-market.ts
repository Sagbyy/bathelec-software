import { Chantier } from '@repo/types';

export interface MarketGroup {
  marketId: number;
  marketName: string;
  chantiers: Chantier[];
}

export function groupByMarket(chantiers: Chantier[]): MarketGroup[] {
  const map = new Map<number, MarketGroup>();
  for (const chantier of chantiers) {
    const marketId = chantier.market?.id ?? chantier.marketId;
    const marketName = chantier.market?.name ?? 'Marché inconnu';
    if (!map.has(marketId)) {
      map.set(marketId, { marketId, marketName, chantiers: [] });
    }
    map.get(marketId)!.chantiers.push(chantier);
  }
  return Array.from(map.values()).sort((a, b) =>
    a.marketName.localeCompare(b.marketName)
  );
}
