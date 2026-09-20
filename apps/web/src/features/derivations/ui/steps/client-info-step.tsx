'use client';

import type { UseFormReturn } from 'react-hook-form';
import type { CreateCompletedDerivation } from '@/entities/derivation';
import { useDerivationStatusStore } from '@/entities/derivation';
import { PhoneInput } from '@/shared/ui/phone-input';
import { LabeledInput } from '@/shared/ui/labeled-input';
import { LabeledField } from '@/shared/ui/labeled-field';

interface ClientInfoStepProps {
  form: UseFormReturn<CreateCompletedDerivation>;
}

const toUpper = (v: string) => v.toUpperCase();

export function ClientInfoStep({ form }: ClientInfoStepProps) {
  const { isNotEditable: isCompleted } = useDerivationStatusStore();

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">1. Informations client</div>

      <LabeledInput
        control={form.control}
        name="clientInfo.name"
        label="Nom du client"
        placeholder="Ex: M. Dupont"
        disabled={isCompleted}
        required
        transform={toUpper}
      />

      <LabeledField
        control={form.control}
        name="clientInfo.phone"
        label="Téléphone"
      >
        {(field) => (
          <PhoneInput
            {...field}
            disabled={isCompleted}
            defaultCountry="FR"
            international
            placeholder="Ex: +33 6 12 34 56 78"
          />
        )}
      </LabeledField>

      <LabeledInput
        control={form.control}
        name="clientInfo.folio"
        label="Folio"
        placeholder="Ex: SGX001 - COM001 - ASC001 - 001 - 101"
        disabled={isCompleted}
        required
        transform={toUpper}
      />
    </div>
  );
}
