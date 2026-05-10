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
import { Textarea } from '@/components/ui/textarea';
import { LabeledField } from '@/components/shared/labeled-field';
import { LabeledInput } from '@/components/shared/labeled-input';
import { LabeledSelect } from '@/components/shared/labeled-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateTimePicker24h } from '../date-time-picker-hours';
import { useTechnicians } from '@/entities/user';
import type { CreateCompletedDerivation } from '@/entities/derivation';
import { useDerivationStatusStore } from '@/entities/derivation';
import { useUserStore } from '@/entities/user';
import { useEffect, useState } from 'react';
import { Derivation } from '@repo/types';
import { Address } from '@repo/types';

interface GeneralInfoStepProps {
  form: UseFormReturn<CreateCompletedDerivation>;
  derivation: Derivation;
}

export function GeneralInfoStep({ form, derivation }: GeneralInfoStepProps) {
  const { data: technicians, isLoading, error } = useTechnicians();
  const { user } = useUserStore();
  const { isNotEditable: isCompleted } = useDerivationStatusStore();
  const [isStaticAddress, setIsStaticAddress] = useState(false);

  useEffect(() => {
    if (derivation.address && derivation.postalCode && derivation.city) {
      form.setValue('generalInfo.address.street', derivation.address);
      form.setValue(
        'generalInfo.address.postalCode',
        String(derivation.postalCode)
      );
      form.setValue('generalInfo.address.city', derivation.city);
      setIsStaticAddress(true);
    }
  }, []);

  const situationValue = form.watch('generalInfo.situation');
  const predefinedSituations = [
    'left',
    'right',
    'front',
    'left_front',
    'right_front',
    'other',
  ];
  const isCustomValue =
    situationValue && !predefinedSituations.includes(situationValue);
  const isOtherSelected = situationValue === 'other' || isCustomValue;

  const selectValue = isCustomValue ? 'other' : situationValue;

  useEffect(() => {
    if (technicians) {
      form.setValue(
        'generalInfo.derivationBy',
        technicians
          .find((technician) => technician.id === user?.id)
          ?.id.toString() || ''
      );
    }
  }, [technicians, user, form]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">2. Informations générales</div>

      <FormField
        control={form.control}
        name="generalInfo.dateTime"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>
              Date et heure<span className="ml-1 text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <DateTimePicker24h
                field={{
                  value: field.value,
                  onChange: field.onChange,
                  onBlur: field.onBlur,
                  name: field.name,
                  ref: field.ref,
                  disabled: isCompleted,
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="generalInfo.derivationBy"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Dérivation réalisée par
              <span className="ml-1 text-red-500">*</span>
            </FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={
                technicians?.find((technician) => technician.id === user?.id)
                  ? user?.id.toString()
                  : field.value
              }
              disabled={isCompleted}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un technicien" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {technicians?.map((technician) => (
                  <SelectItem
                    key={technician.id}
                    value={technician.id.toString()}
                  >
                    {technician.firstName} {technician.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <div className="font-medium">Adresse du chantier</div>

        <LabeledField
          control={form.control}
          name="generalInfo.address.street"
          label="N° et Rue"
          required
        >
          {(field) => (
            <Input
              {...field}
              disabled={isCompleted || isStaticAddress}
              value={isStaticAddress ? derivation.address : field.value}
              onChange={(e) => field.onChange(e.target.value.toUpperCase())}
            />
          )}
        </LabeledField>

        <LabeledField
          control={form.control}
          name="generalInfo.address.postalCode"
          label="Code Postal"
          required
        >
          {(field) => (
            <Input
              {...field}
              disabled={isCompleted || isStaticAddress}
              value={isStaticAddress ? derivation.postalCode : field.value}
            />
          )}
        </LabeledField>

        <LabeledField
          control={form.control}
          name="generalInfo.address.city"
          label="Ville"
          required
        >
          {(field) => (
            <Input
              {...field}
              disabled={isCompleted || isStaticAddress}
              value={isStaticAddress ? derivation.city : field.value}
              onChange={(e) => field.onChange(e.target.value.toUpperCase())}
            />
          )}
        </LabeledField>
      </div>

      <LabeledInput
        control={form.control}
        name="generalInfo.building"
        label="Bâtiment"
        placeholder="Ex: A - B / Rue - Cour"
        disabled={isCompleted}
        required
        transform={(v) => v.toUpperCase()}
      />

      <LabeledInput
        control={form.control}
        name="generalInfo.cmIdentification"
        label="Identification CM"
        placeholder="Ex: 1D001 - 1C101 - 2C101"
        disabled={isCompleted}
        required
        transform={(v) => v.toUpperCase()}
      />

      <LabeledSelect
        control={form.control}
        name="generalInfo.floor"
        label="Étage"
        placeholder="Sélectionner un étage"
        disabled={isCompleted}
      >
        {['rdc', ...Array.from({ length: 20 }, (_, i) => String(i + 1))].map(
          (v) => (
            <SelectItem key={v} value={v}>
              {v === 'rdc' ? 'Rez-de-chaussée' : v}
            </SelectItem>
          )
        )}
      </LabeledSelect>

      <FormField
        control={form.control}
        name="generalInfo.situation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Situation</FormLabel>
            <Select
              onValueChange={(value) => {
                if (value === 'other') {
                  field.onChange(isCustomValue ? situationValue : 'other');
                } else {
                  field.onChange(value);
                }
              }}
              value={selectValue}
              disabled={isCompleted}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une situation" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="left">Gauche</SelectItem>
                <SelectItem value="right">Droite</SelectItem>
                <SelectItem value="front">En face</SelectItem>
                <SelectItem value="left_front">Face gauche</SelectItem>
                <SelectItem value="right_front">Face droite</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
            {isOtherSelected && (
              <FormControl>
                <Input
                  placeholder="Préciser la situation"
                  value={isCustomValue ? situationValue : ''}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  onBlur={field.onBlur}
                  disabled={isCompleted}
                  className="mt-2"
                />
              </FormControl>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <LabeledField control={form.control} name="generalInfo.comment" label="Commentaire">
        {(field) => (
          <Textarea
            placeholder="Commentaires additionnels..."
            className="resize-none"
            {...field}
            disabled={isCompleted}
          />
        )}
      </LabeledField>
    </div>
  );
}
