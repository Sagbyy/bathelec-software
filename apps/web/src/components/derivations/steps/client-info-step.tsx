'use client';

import type { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { CreateCompletedDerivation } from '@/types/completed-derivation.types';
import { useDerivationStatusStore } from '@/hooks/use-derivation-status.store';
interface ClientInfoStepProps {
  form: UseFormReturn<CreateCompletedDerivation>;
}

export function ClientInfoStep({ form }: ClientInfoStepProps) {
  const { isCompleted } = useDerivationStatusStore();

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">1. Informations client</div>

      <FormField
        control={form.control}
        name="clientInfo.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Nom du client<span className="ml-1 text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: M. Dupont"
                {...field}
                disabled={isCompleted}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="clientInfo.phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Téléphone</FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: 01 55 99 03 89"
                {...field}
                disabled={isCompleted}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="clientInfo.folio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Folio<span className="ml-1 text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: SGX001 - COM001 - ASC001 - 001 - 101"
                {...field}
                disabled={isCompleted}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
