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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateTimePicker24h } from '../date-time-picker-hours';
import { useTechnicians } from '@/hooks/queries/use-technician';
import type { CreateCompletedDerivation } from '@/types/completed-derivation.types';
import { useDerivationStatusStore } from '@/hooks/use-derivation-status.store';
import { useUserStore } from '@/hooks/use-user-store';
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

      <LabeledField
        control={form.control}
        name="generalInfo.building"
        label="Bâtiment"
        required
      >
        {(field) => (
          <Input
            placeholder="Ex: A - B / Rue - Cour"
            {...field}
            disabled={isCompleted}
            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
          />
        )}
      </LabeledField>

      <LabeledField
        control={form.control}
        name="generalInfo.cmIdentification"
        label="Identification CM"
        required
      >
        {(field) => (
          <Input
            placeholder="Ex: 1D001 - 1C101 - 2C101"
            {...field}
            disabled={isCompleted}
            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
          />
        )}
      </LabeledField>

      <FormField
        control={form.control}
        name="generalInfo.floor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Étage</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isCompleted}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un étage" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="rdc">Rez-de-chaussée</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="7">7</SelectItem>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="9">9</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="11">11</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="13">13</SelectItem>
                <SelectItem value="14">14</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="16">16</SelectItem>
                <SelectItem value="17">17</SelectItem>
                <SelectItem value="18">18</SelectItem>
                <SelectItem value="19">19</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

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
