'use client';

import { Award } from 'lucide-react';
import { EmptyState } from '@/shared/ui/empty-state';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Badge } from '@/shared/ui/badge';
import { ValidityBadge } from '@/shared/ui/validity-date-field';
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
  expiresAt,
}: {
  config: SpecialHabilitationConfig;
  enabled: boolean;
  document: string | null;
  expiresAt: string | null;
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
        'bg-card shadow-card flex flex-col items-center gap-3 rounded-xl border p-4 transition-all sm:p-5',
        clickable &&
          'hover:border-primary/30 hover:shadow-elevated focus-visible:ring-ring cursor-pointer hover:-translate-y-0.5 focus-visible:ring-2',
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

      <p className="text-foreground text-center text-sm font-semibold leading-tight">
        {config.label}
      </p>

      {!enabled && <Badge variant="neutral">Non attribuée</Badge>}

      {enabled && hasDocument && (
        <>
          <Badge variant="success">
            <Icon
              icon="material-symbols:description-rounded"
              className="h-3 w-3"
            />
            Document disponible
          </Badge>
          <ValidityBadge expiresAt={expiresAt} />
        </>
      )}

      {enabled && !hasDocument && (
        <Badge variant="neutral">
          <Icon
            icon="material-symbols:description-outline-rounded"
            className="h-3 w-3"
          />
          Pas de document
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
      <EmptyState
        icon={<Award />}
        title="Aucun titre ou certificat attribué."
      />
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
          expiresAt={data[`${config.docKey}ExpiresAt`] ?? null}
        />
      ))}
    </div>
  );
}
