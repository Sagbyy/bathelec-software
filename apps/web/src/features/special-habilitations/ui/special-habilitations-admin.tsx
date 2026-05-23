'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/shared/lib/utils';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Switch } from '@/shared/ui/switch';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { Badge } from '@/shared/ui/badge';
import {
  DEFAULT_SPECIAL_HABILITATIONS,
  SPECIAL_HABILITATION_CONFIG,
  SpecialHabilitationConfig,
  useSpecialHabilitation,
  useUpdateSpecialHabilitation,
} from '@/entities/special-habilitation';

interface SpecialHabilitationsAdminProps {
  technicianId: number;
}

function SpecialHabilitationRow({
  config,
  enabled,
  hasDocument,
  document,
  isPending,
  onToggle,
  onUpload,
  onRemoveDoc,
}: {
  config: SpecialHabilitationConfig;
  enabled: boolean;
  hasDocument: boolean;
  document: string | null;
  isPending: boolean;
  onToggle: (value: boolean) => void;
  onUpload: (base64: string) => void;
  onRemoveDoc: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onUpload(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image
            src={config.image}
            alt={config.label}
            width={40}
            height={40}
            className={cn(
              'h-10 w-10 object-contain transition-all',
              !enabled && 'opacity-40 grayscale'
            )}
          />
          <div>
            <Label className="text-sm font-semibold text-gray-900">
              {config.label}
            </Label>
            {hasDocument ? (
              <Badge className="ml-2 gap-1 bg-green-100 text-xs text-green-700 hover:bg-green-100">
                <Icon
                  icon="material-symbols:description-rounded"
                  className="h-3 w-3"
                />
                Document joint
              </Badge>
            ) : (
              <Badge variant="secondary" className="ml-2 text-xs text-gray-400">
                Pas de document
              </Badge>
            )}
          </div>
        </div>

        <Switch
          checked={enabled}
          onCheckedChange={onToggle}
          disabled={isPending}
        />
      </div>

      {enabled && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
          <input
            ref={inputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = '';
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => inputRef.current?.click()}
            className="gap-1.5"
          >
            <Icon icon="material-symbols:upload-rounded" className="h-4 w-4" />
            {hasDocument ? 'Remplacer le document' : 'Joindre un document'}
          </Button>
          {hasDocument && document && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.open(document, '_blank')}
              className="gap-1.5"
            >
              <Icon
                icon="material-symbols:open-in-new-rounded"
                className="h-4 w-4"
              />
              Prévisualiser
            </Button>
          )}
          {hasDocument && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={onRemoveDoc}
              className="gap-1.5 text-red-500 hover:text-red-600"
            >
              <Icon
                icon="material-symbols:delete-outline-rounded"
                className="h-4 w-4"
              />
              Supprimer
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function SpecialHabilitationsAdmin({
  technicianId,
}: SpecialHabilitationsAdminProps) {
  const { data, isLoading } = useSpecialHabilitation(technicianId);
  const { mutate, isPending } = useUpdateSpecialHabilitation(technicianId);

  const habilitations = data ?? {
    userId: technicianId,
    ...DEFAULT_SPECIAL_HABILITATIONS,
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-gray-400">
        Chargement…
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {SPECIAL_HABILITATION_CONFIG.map((config) => (
        <SpecialHabilitationRow
          key={config.key}
          config={config}
          enabled={habilitations[config.key]}
          hasDocument={!!habilitations[config.docKey]}
          document={habilitations[config.docKey]}
          isPending={isPending}
          onToggle={(value) => mutate({ [config.key]: value })}
          onUpload={(base64) => mutate({ [config.docKey]: base64 })}
          onRemoveDoc={() => mutate({ [config.docKey]: null })}
        />
      ))}
    </div>
  );
}
