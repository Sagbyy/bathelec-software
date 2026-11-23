'use client';

import {
  formatValidityDate,
  getValidityStatus,
  toDateInputValue,
  ValidityStatus,
} from '@/shared/lib/document-validity';
import type { Tone } from '@/shared/lib/tone';
import { Badge } from './badge';
import { Input } from './input';
import { Label } from './label';

const STATUS_TONES: Record<ValidityStatus, Tone> = {
  missing: 'neutral',
  expired: 'brand',
  expiring: 'warning',
  valid: 'success',
};

const statusLabel = (status: ValidityStatus, expiresAt?: string | null) => {
  if (status === 'missing' || !expiresAt) return 'Date de validité manquante';
  const date = formatValidityDate(expiresAt);
  if (status === 'expired') return `Expiré depuis le ${date}`;
  if (status === 'expiring') return `Expire bientôt (${date})`;
  return `Valide jusqu'au ${date}`;
};

export function ValidityBadge({ expiresAt }: { expiresAt?: string | null }) {
  const status = getValidityStatus(expiresAt);
  return (
    <Badge variant={STATUS_TONES[status]}>
      {statusLabel(status, expiresAt)}
    </Badge>
  );
}

interface ValidityDateFieldProps {
  id: string;
  value?: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
  label?: string;
}

export function ValidityDateField({
  id,
  value,
  onChange,
  disabled = false,
  label = 'Date de fin de validité',
}: ValidityDateFieldProps) {
  return (
    <div className="flex max-w-md flex-col gap-1.5">
      <Label htmlFor={id} className="text-sm">
        {label} <span className="text-destructive">*</span>
      </Label>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          id={id}
          type="date"
          className="w-full sm:w-44"
          value={toDateInputValue(value)}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value || null)}
        />
        <ValidityBadge expiresAt={value} />
      </div>
    </div>
  );
}
