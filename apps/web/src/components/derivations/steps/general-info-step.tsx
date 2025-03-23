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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateTimePicker24h } from '../date-time-picker-hours';
import { useTechnicians } from '@/hooks/queries/useTechnician';
import type { CreateCompletedDerivation } from '@/types/completed-derivation.types';
import { useDerivationStatusStore } from '@/hooks/use-derivation-status.store';

interface GeneralInfoStepProps {
  form: UseFormReturn<CreateCompletedDerivation>;
}

export function GeneralInfoStep({ form }: GeneralInfoStepProps) {
  const { data: technicians, isLoading, error } = useTechnicians();
  const { isCompleted } = useDerivationStatusStore();

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
              defaultValue={field.value}
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

        <FormField
          control={form.control}
          name="generalInfo.address.street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                N° et Rue<span className="ml-1 text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} disabled={isCompleted} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="generalInfo.address.postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Code Postal<span className="ml-1 text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} disabled={isCompleted} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="generalInfo.address.city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Ville<span className="ml-1 text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} disabled={isCompleted} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="generalInfo.building"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Bâtiment<span className="ml-1 text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: A - B / Rue - Cour"
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
        name="generalInfo.cmIdentification"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Identification CM<span className="ml-1 text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Ex: 1D001 - 1C101 - 2C101"
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
                <SelectItem value="1">1er étage</SelectItem>
                <SelectItem value="2">2ème étage</SelectItem>
                <SelectItem value="3">3ème étage</SelectItem>
                <SelectItem value="4">4ème étage</SelectItem>
                <SelectItem value="5">5ème étage et plus</SelectItem>
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
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isCompleted}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une situation" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="interieur">Intérieur</SelectItem>
                <SelectItem value="exterieur">Extérieur</SelectItem>
                <SelectItem value="facade">Façade</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="generalInfo.comment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Commentaire</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Commentaires additionnels..."
                className="resize-none"
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
