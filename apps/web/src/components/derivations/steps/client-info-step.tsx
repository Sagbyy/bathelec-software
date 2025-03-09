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
import type { z } from 'zod';
import type { formSchema } from '@/lib/validations/derivationForm';

type FormValues = z.infer<typeof formSchema>;

interface ClientInfoStepProps {
  form: UseFormReturn<FormValues>;
}

export function ClientInfoStep({ form }: ClientInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">1. Informations client</div>

      <FormField
        control={form.control}
        name="clientInfo.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom du client</FormLabel>
            <FormControl>
              <Input placeholder="Ex: M. Dupont" {...field} />
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
              <Input placeholder="Ex: 01 55 99 03 89" {...field} />
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
            <FormLabel>Folio</FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: SGX001 - COM001 - ASC001 - 001 - 101"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
