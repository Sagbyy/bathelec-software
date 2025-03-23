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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreateCompletedDerivation } from '@/types/completed-derivation.types';
import { useDerivationStatusStore } from '@/hooks/use-derivation-status.store';


interface NewDerivationStepProps {
  form: UseFormReturn<CreateCompletedDerivation>;
}

export function NewDerivationStep({ form }: NewDerivationStepProps) {
  const { isCompleted } = useDerivationStatusStore();
  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">5. La nouvelle dérivation</div>

      <FormField
        control={form.control}
        name="newDerivation.section"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Section posée<span className="ml-1 text-red-500">*</span>
            </FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isCompleted}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une section" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1.5">1.5 mm²</SelectItem>
                <SelectItem value="2.5">2.5 mm²</SelectItem>
                <SelectItem value="4">4 mm²</SelectItem>
                <SelectItem value="6">6 mm²</SelectItem>
                <SelectItem value="10">10 mm²</SelectItem>
                <SelectItem value="16">16 mm²</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="newDerivation.cableType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Nature du câble<span className="ml-1 text-red-500">*</span>
            </FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isCompleted}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type de câble" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="cuivre">Cuivre</SelectItem>
                <SelectItem value="aluminium">Aluminium</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="newDerivation.length"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Longueur posée en M<span className="ml-1 text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Indiquer la longueur de câble posée"
                {...field}
                onChange={(e) =>
                  field.onChange(Number.parseFloat(e.target.value) || 0)
                }
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
