'use client';

import Image from 'next/image';
import { cn } from '@/shared/lib/utils';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Badge } from '@/shared/ui/badge';
import {
  DEFAULT_SPECIAL_HABILITATIONS,
  SPECIAL_HABILITATION_CONFIG,
  SpecialHabilitationConfig,
  SpecialHabilitations,
} from '@/entities/special-habilitation';

interface SpecialHabilitationsCardsProps {
  habilitations: SpecialHabilitations | null;
}

function SpecialHabilitationCard({
  config,
  enabled,
  document,
}: {
  config: SpecialHabilitationConfig;
  enabled: boolean;
  document: string | null;
}) {
  const hasDocument = !!document;
  const clickable = enabled && hasDocument;

  return (
    <div
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={
        clickable
          ? (e) => e.key === 'Enter' && window.open(document!, '_blank')
          : undefined
      }
      onClick={clickable ? () => window.open(document!, '_blank') : undefined}
      className={cn(
        'flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white p-5 transition-all',
        clickable && 'cursor-pointer hover:shadow-md',
        !enabled && 'opacity-50'
      )}
    >
      <div className="relative h-24 w-24">
        <Image
          src={config.image}
          alt={config.label}
          width={96}
          height={96}
          className={cn(
            'h-24 w-24 object-contain transition-all',
            !enabled && 'grayscale'
          )}
        />
      </div>

      <p className="text-center text-sm font-semibold leading-tight text-gray-800">
        {config.label}
      </p>

      {enabled ? (
        hasDocument ? (
          <Badge className="gap-1 bg-green-100 text-green-700 hover:bg-green-100">
            <Icon
              icon="material-symbols:description-rounded"
              className="h-3 w-3"
            />
            Document disponible
          </Badge>
        ) : (
          <Badge variant="secondary" className="gap-1 text-gray-400">
            <Icon
              icon="material-symbols:description-outline-rounded"
              className="h-3 w-3"
            />
            Pas de document
          </Badge>
        )
      ) : (
        <Badge variant="secondary" className="text-gray-300">
          Non attribuée
        </Badge>
      )}
    </div>
  );
}

export function SpecialHabilitationsCards({
  habilitations,
}: SpecialHabilitationsCardsProps) {
  const data = habilitations ?? DEFAULT_SPECIAL_HABILITATIONS;
  const activeConfigs = SPECIAL_HABILITATION_CONFIG.filter(
    (config) => data[config.key]
  );

  if (activeConfigs.length === 0) {
    return (
      <p className="text-sm text-gray-400">Aucun titre ou certificat attribué.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {activeConfigs.map((config) => (
        <SpecialHabilitationCard
          key={config.key}
          config={config}
          enabled={data[config.key]}
          document={data[config.docKey]}
        />
      ))}
    </div>
  );
}
