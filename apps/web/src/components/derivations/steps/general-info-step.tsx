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
import type { z } from 'zod';
import type { formSchema } from '@/lib/validations/derivationForm';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type FormValues = z.infer<typeof formSchema>;

interface GeneralInfoStepProps {
  form: UseFormReturn<FormValues>;
}

export function GeneralInfoStep({ form }: GeneralInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">2. Informations générales</div>

      <FormField
        control={form.control}
        name="generalInfo.dateTime"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date et heure</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full pl-3 text-left font-normal',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    {field.value ? (
                      format(field.value, 'PPP', { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="generalInfo.derivationBy"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dérivation réalisée par</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un technicien" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="tech1">Technicien 1</SelectItem>
                <SelectItem value="tech2">Technicien 2</SelectItem>
                <SelectItem value="tech3">Technicien 3</SelectItem>
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
              <FormLabel>N° et Rue</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Code Postal</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Ville</FormLabel>
              <FormControl>
                <Input {...field} />
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
            <FormLabel>Bâtiment</FormLabel>
            <FormControl>
              <Input placeholder="Ex: A - B / Rue - Cour" {...field} />
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
            <FormLabel>Identification CM</FormLabel>
            <FormControl>
              <Input placeholder="Ex: 1D001 - 1C101 - 2C101" {...field} />
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
