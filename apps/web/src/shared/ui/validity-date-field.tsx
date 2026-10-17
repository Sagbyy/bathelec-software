'use client';

import {
  formatValidityDate,
  getValidityStatus,
  toDateInputValue,
  ValidityStatus,
} from '@/shared/lib/document-validity';
import { cn } from '@/shared/lib/utils';
import { Input } from './input';
import { Label } from './label';

const STATUS_STYLES: Record<ValidityStatus, string> = {
  missing: 'bg-gray-100 text-gray-500',
  expired: 'bg-red-100 text-red-700',
  expiring: 'bg-orange-100 text-orange-700',
  valid: 'bg-green-100 text-green-700',
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
    <span
      className={cn(
        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
        STATUS_STYLES[status]
      )}
    >
      {statusLabel(status, expiresAt)}
    </span>
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
        {label} <span className="text-red-500">*</span>
      </Label>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          id={id}
          type="date"
          className="w-44"
          value={toDateInputValue(value)}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value || null)}
        />
        <ValidityBadge expiresAt={value} />
      </div>
    </div>
  );
}
