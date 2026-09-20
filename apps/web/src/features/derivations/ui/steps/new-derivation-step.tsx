'use client';

import type { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { CreateCompletedDerivation } from '@/entities/derivation';
import {
  CABLE_SECTIONS,
  isCableLengthValidForSection,
  useDerivationStatusStore,
} from '@/entities/derivation';
import { cn } from '@/shared/lib/utils';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Icon } from '@iconify/react/dist/iconify.js';
import InputNumberButtonsRounded from '@/shared/ui/input-number-buttons';

interface NewDerivationStepProps {
  form: UseFormReturn<CreateCompletedDerivation>;
}

export function NewDerivationStep({ form }: NewDerivationStepProps) {
  const { isNotEditable: isCompleted } = useDerivationStatusStore();

  const section = form.watch('newDerivation.section');
  const length = form.watch('newDerivation.length');
  const isLengthCoherent = isCableLengthValidForSection(length, section);

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">5. La nouvelle dérivation</div>

      <FormField
        control={form.control}
        name="newDerivation.section"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={cn(!isLengthCoherent && 'text-red-500')}>
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
                {CABLE_SECTIONS.map((sectionOption) => (
                  <SelectItem key={sectionOption} value={sectionOption}>
                    {sectionOption} mm²
                  </SelectItem>
                ))}
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
            <FormLabel className={cn(!isLengthCoherent && 'text-red-500')}>
              Longueur posée en M<span className="ml-1 text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <InputNumberButtonsRounded
                defaultValue={field.value}
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
      {!isLengthCoherent && (
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
