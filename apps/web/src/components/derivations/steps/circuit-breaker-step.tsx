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
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import type { CreateCompletedDerivation } from '@/types/completed-derivation.types';
import { useDerivationStatusStore } from '@/hooks/use-derivation-status.store';

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
                defaultValue={field.value}
                className="flex flex-row space-x-4"
                disabled={isCompleted}
              >
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="mono" />
                  </FormControl>
                  <FormLabel className="font-normal">Mono</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="tri" />
                  </FormControl>
                  <FormLabel className="font-normal">Tri</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="circuitBreaker.brand"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Marque <span className="ml-1 text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: BACO, GE, SCHNEIDER..."
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
        name="circuitBreaker.type"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>
              Type <span className="ml-1 text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="space-y-1"
                disabled={isCompleted}
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="non_differentiel" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Non différentiel
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="differentiel" />
                  </FormControl>
                  <FormLabel className="font-normal">Différentiel</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="selectif" />
                  </FormControl>
                  <FormLabel className="font-normal">Sélectif</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="circuitBreaker.power"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Puissance <span className="ml-1 text-red-500">*</span>
            </FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isCompleted}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une puissance" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
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
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

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
