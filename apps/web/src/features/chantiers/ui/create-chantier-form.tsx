'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useCreateChantier } from '@/entities/chantier';
import { useMarkets } from '@/entities/market';
import { getApiErrorMessage } from '@/shared/lib/api-error';
import { Button } from '@/shared/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import {
  CreateChantierFormData,
  createChantierSchema,
} from '../model/chantiers-admin.schema';

export function CreateChantierForm() {
  const { data: markets, isLoading: marketsLoading } = useMarkets();
  const createChantier = useCreateChantier();
  const form = useForm<CreateChantierFormData>({
    resolver: zodResolver(createChantierSchema),
    defaultValues: {
      address: '',
      enedisAffaireNumber: '',
      internalAffaireNumber: '',
      marketId: undefined,
    },
  });

  const onSubmit = (data: CreateChantierFormData) => {
    createChantier.mutate(data, {
      onSuccess: () => {
        toast.success('Chantier créé avec succès');
        form.reset();
      },
      onError: (error: Error) => {
        toast.error(
          getApiErrorMessage(error) ||
            'Une erreur est survenue lors de la création du chantier'
        );
      },
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="marketId"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={clsx(
                  form.formState.errors.marketId && 'text-red-500'
                )}
              >
                Marché
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value ? String(field.value) : undefined}
                disabled={marketsLoading || !markets?.length}
              >
                <FormControl>
                  <SelectTrigger
                    className={clsx(
                      form.formState.errors.marketId && 'border-red-500'
                    )}
                  >
                    <SelectValue
                      placeholder={
                        marketsLoading
                          ? 'Chargement des marchés...'
                          : 'Sélectionner un marché'
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {markets?.map((market) => (
                    <SelectItem key={market.id} value={String(market.id)}>
                      {market.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!marketsLoading && !markets?.length && (
                <p className="text-muted-foreground text-sm">
                  Créez d'abord un marché avant d'ajouter un chantier.
                </p>
              )}
              <FormMessage>
                {form.formState.errors.marketId?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={clsx(
                  form.formState.errors.address && 'text-red-500'
                )}
              >
                Adresse du chantier
              </FormLabel>
              <FormControl>
                <Input
                  className={clsx(
                    form.formState.errors.address && 'border-red-500'
                  )}
                  placeholder="12 rue de la Paix"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage>
                {form.formState.errors.address?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <div className="grid gap-4 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="enedisAffaireNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={clsx(
                    form.formState.errors.enedisAffaireNumber && 'text-red-500'
                  )}
                >
                  Numéro d'affaire Enedis
                </FormLabel>
                <FormControl>
                  <Input
                    className={clsx(
                      form.formState.errors.enedisAffaireNumber &&
                        'border-red-500'
                    )}
                    placeholder="AFF-ENEDIS-2026-001"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.enedisAffaireNumber?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="internalAffaireNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={clsx(
                    form.formState.errors.internalAffaireNumber &&
                      'text-red-500'
                  )}
                >
                  Numéro d'affaire interne
                </FormLabel>
                <FormControl>
                  <Input
                    className={clsx(
                      form.formState.errors.internalAffaireNumber &&
                        'border-red-500'
                    )}
                    placeholder="INT-2026-001"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.internalAffaireNumber?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={
            createChantier.isPending || marketsLoading || !markets?.length
          }
        >
          {createChantier.isPending ? 'Création...' : 'Créer le chantier'}
        </Button>
      </form>
    </FormProvider>
  );
}
