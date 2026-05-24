'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useCreateMarket } from '@/entities/market';
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
  CreateMarketFormData,
  createMarketSchema,
} from '../model/chantiers-admin.schema';

export function CreateMarketForm() {
  const createMarket = useCreateMarket();
  const form = useForm<CreateMarketFormData>({
    resolver: zodResolver(createMarketSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = (data: CreateMarketFormData) => {
    createMarket.mutate(data, {
      onSuccess: () => {
        toast.success(`Marché ${data.name} créé avec succès`);
        form.reset();
      },
      onError: (error: Error) => {
        toast.error(
          getApiErrorMessage(error) ||
            'Une erreur est survenue lors de la création du marché'
        );
      },
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                className={clsx(form.formState.errors.name && 'text-red-500')}
              >
                Nom du marché
              </FormLabel>
              <FormControl>
                <Input
                  className={clsx(
                    form.formState.errors.name && 'border-red-500'
                  )}
                  placeholder="Marché IDF 2026"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.name?.message}</FormMessage>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={createMarket.isPending}
        >
          {createMarket.isPending ? 'Création...' : 'Créer le marché'}
        </Button>
      </form>
    </FormProvider>
  );
}
