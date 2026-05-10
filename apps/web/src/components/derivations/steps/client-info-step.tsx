'use client';

import type { UseFormReturn } from 'react-hook-form';
import type { CreateCompletedDerivation } from '@/types/completed-derivation.types';
import { useDerivationStatusStore } from '@/hooks/use-derivation-status.store';
import { PhoneInput } from '@/components/ui/phone-input';
import { LabeledInput } from '@/components/shared/labeled-input';
import { LabeledField } from '@/components/shared/labeled-field';

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

      <LabeledField control={form.control} name="clientInfo.phone" label="Téléphone">
        {(field) => (
          <PhoneInput
            {...field}
            disabled={isCompleted}
            defaultCountry="FR"
            placeholder="Ex: 01 55 99 03 89"
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
