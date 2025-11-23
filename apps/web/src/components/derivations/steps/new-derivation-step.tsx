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
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Icon } from '@iconify/react/dist/iconify.js';

interface NewDerivationStepProps {
  form: UseFormReturn<CreateCompletedDerivation>;
}

const isLengthValid = (length: number, section: string): boolean => {
  if (section === '2x16') {
    return length <= 10;
  }
  return length <= 20;
};

export function NewDerivationStep({ form }: NewDerivationStepProps) {
  const { isNotEditable: isCompleted } = useDerivationStatusStore();

  const section = form.watch('newDerivation.section');
  const length = form.watch('newDerivation.length');

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">5. La nouvelle dérivation</div>

      <FormField
        control={form.control}
        name="newDerivation.section"
        render={({ field }) => (
          <FormItem>
            <FormLabel
              className={cn(!isLengthValid(length, section) && 'text-red-500')}
            >
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
                <SelectItem value="2x16">2x16 mm²</SelectItem>
                <SelectItem value="2x25">2x25 mm²</SelectItem>
                <SelectItem value="2x35">2x35 mm²</SelectItem>
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
            <FormLabel
              className={cn(!isLengthValid(length, section) && 'text-red-500')}
            >
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
      {!isLengthValid(length, section) && (
        <Alert variant="destructive" className="mb-6 flex items-center gap-2">
          <div>
            <Icon icon="si:alert-line" className="size-4" />
          </div>
          <AlertDescription>
            Merci de confirmer la section, et de vérifier par rapport au projet.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
