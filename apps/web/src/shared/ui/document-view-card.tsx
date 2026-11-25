'use client';

import Image from 'next/image';
import { FileX } from 'lucide-react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { DocumentValidityBadge } from './validity-date-field';

interface DocumentViewCardProps {
  label: string;
  value: string | null;
  expiresAt?: string | null;
}

export function DocumentViewCard({
  label,
  value,
  expiresAt = null,
}: DocumentViewCardProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <DocumentValidityBadge hasDocument={!!value} expiresAt={expiresAt} />
      </div>

      {value ? (
        <div className="relative h-52 w-full max-w-md overflow-hidden rounded-md border">
          <Zoom>
            <Image
              src={value}
              alt={`Aperçu ${label}`}
              fill
              className="object-contain"
            />
          </Zoom>
        </div>
      ) : (
        <div className="flex w-full max-w-md items-center gap-2 rounded-xl border border-dashed bg-muted/40 p-4 text-sm text-muted-foreground">
          <FileX className="size-4 shrink-0" />
          Document non fourni par le technicien
        </div>
      )}
    </div>
  );
}
