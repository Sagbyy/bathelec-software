'use client';

import type { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import type { CreateCompletedDerivation } from '@/types/completed-derivation.types';
import { useDerivationStatusStore } from '@/hooks/use-derivation-status.store';
import { PhoneInput } from '@/components/ui/phone-input';
import { LabeledField } from '@/components/shared/labeled-field';

interface ClientInfoStepProps {
  form: UseFormReturn<CreateCompletedDerivation>;
}

export function ClientInfoStep({ form }: ClientInfoStepProps) {
  const { isNotEditable: isCompleted } = useDerivationStatusStore();

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">1. Informations client</div>

      <LabeledField
        control={form.control}
        name="clientInfo.name"
        label="Nom du client"
        required
      >
        {(field) => (
          <Input
            placeholder="Ex: M. Dupont"
            {...field}
            disabled={isCompleted}
            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
          />
        )}
      </LabeledField>

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
            placeholder="Ex: 01 55 99 03 89"
          />
        )}
      </LabeledField>

      <LabeledField
        control={form.control}
        name="clientInfo.folio"
        label="Folio"
        required
      >
        {(field) => (
          <Input
            placeholder="Ex: SGX001 - COM001 - ASC001 - 001 - 101"
            {...field}
            disabled={isCompleted}
            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
          />
        )}
      </LabeledField>
    </div>
  );
}
