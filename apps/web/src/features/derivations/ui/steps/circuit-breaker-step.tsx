'use client';

import type { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { SelectItem } from '@/components/ui/select';
import { LabeledInput } from '@/components/shared/labeled-input';
import { LabeledSelect } from '@/components/shared/labeled-select';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import type { CreateCompletedDerivation } from '@/entities/derivation';
import { useDerivationStatusStore } from '@/entities/derivation';

interface CircuitBreakerStepProps {
  form: UseFormReturn<CreateCompletedDerivation>;
}

export function CircuitBreakerStep({ form }: CircuitBreakerStepProps) {
  const oldMeterPreserved = form.watch('oldMeter.preserved');
  const { isNotEditable: isCompleted } = useDerivationStatusStore();

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">
        {oldMeterPreserved ? 6 : 7}. Disjoncteur
      </div>

      <Alert variant="destructive" className="mb-6">
        <AlertTriangle />
        <AlertDescription>
          Avant travaux, tester sous-tension le bouton test du disjoncteur. Si
          le bouton test ne fonctionne pas, le remplacement du disjoncteur est
          obligatoire (même si le disjoncteur est récent). Si pas de bouton
          test, remplacer impérativement le disjoncteur d'abonnée.
        </AlertDescription>
      </Alert>

      <FormField
        control={form.control}
        name="circuitBreaker.preserved"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Conservé</FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isCompleted}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="circuitBreaker.voltage"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>
              Voltage <span className="ml-1 text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-row space-x-4"
                disabled={isCompleted}
                required
              >
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="mono" id="mono" />
                  </FormControl>
                  <FormLabel className="font-normal">Mono</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="tri" id="tri" />
                  </FormControl>
                  <FormLabel className="font-normal">Tri</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <LabeledInput
        control={form.control}
        name="circuitBreaker.brand"
        label="Marque"
        placeholder="Ex: BACO, GE, SCHNEIDER..."
        disabled={isCompleted}
        required
        transform={(v) => v.toUpperCase()}
      />

      <FormField
        control={form.control}
        name="circuitBreaker.type"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>
              Type <span className="ml-1 text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="space-y-1"
                disabled={isCompleted}
                required
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem
                      value="non_differentiel"
                      id="non_differentiel"
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Non différentiel
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="differentiel" id="differentiel" />
                  </FormControl>
                  <FormLabel className="font-normal">Différentiel</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="selectif" id="selectif" />
                  </FormControl>
                  <FormLabel className="font-normal">Sélectif</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <LabeledSelect
        control={form.control}
        name="circuitBreaker.power"
        label="Puissance"
        placeholder="Sélectionner une puissance"
        disabled={isCompleted}
        required
      >
        <SelectItem value="10-30">10-30 A</SelectItem>
        <SelectItem value="15-45">15-45 A</SelectItem>
        <SelectItem value="30-60">30-60 A</SelectItem>
        <SelectItem value="60-90">60-90 A</SelectItem>
        <SelectItem value="10">10 A</SelectItem>
        <SelectItem value="15">15 A</SelectItem>
        <SelectItem value="20">20 A</SelectItem>
        <SelectItem value="30">30 A</SelectItem>
        <SelectItem value="40">40 A</SelectItem>
        <SelectItem value="50">50 A</SelectItem>
        <SelectItem value="60">60 A</SelectItem>
      </LabeledSelect>

      <FormField
        control={form.control}
        name="circuitBreaker.commissioningDone"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Mise en service effectuée
              </FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isCompleted}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="circuitBreaker.sealed"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Plombage</FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isCompleted}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {!form.getValues('circuitBreaker.sealed') && (
        <Alert variant="destructive" className="mt-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Le plombage est obligatoire dans tous les cas
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
