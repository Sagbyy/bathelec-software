'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/popover';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import { Technician, Chantier } from '@repo/types';
import { toast } from 'sonner';
import { apiClient } from '@/shared/api';
import { formSchema } from '../model/create-derivation.schema';
import { useUserStore } from '@/entities/user';

const fetchTechnicians = async (): Promise<Technician[]> => {
  const response = await apiClient.get('/users/technicians');
  return response.data;
};

const fetchChantiers = async (): Promise<Chantier[]> => {
  const response = await apiClient.get('/chantiers');
  return response.data;
};

export default function CreateDerivationForm() {
  const [technicianOpen, setTechnicianOpen] = useState(false);
  const [chantierOpen, setChantierOpen] = useState(false);
  const { user } = useUserStore();

  const { data: technicians, isLoading: loadingTechnicians } = useQuery<Technician[]>({
    queryKey: ['technicians'],
    queryFn: fetchTechnicians,
  });

  const { data: chantiers, isLoading: loadingChantiers } = useQuery<Chantier[]>({
    queryKey: ['chantiers'],
    queryFn: fetchChantiers,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: '',
      chantierId: undefined,
    },
  });

  useEffect(() => {
    if (user?.role === 'technician') {
      form.setValue('user', `${user.firstName} ${user.lastName}`);
    }
  }, [user, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const userId: number | undefined = technicians?.find(
      (t) => `${t.firstName} ${t.lastName}` === data.user
    )?.id;

    try {
      const response = await apiClient.post('/derivations', {
        userId,
        chantierId: data.chantierId,
      });

      if (response.status !== 201) {
        throw new Error('Erreur lors de la création de la dérivation');
      }

      form.reset();
      toast.success('Dérivation créée avec succès');
    } catch {
      toast.error("La dérivation n'a pas pu être créée");
    }
  };

  return (
    <FormProvider {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Technicien */}
        <FormField
          control={form.control}
          name="user"
          render={({ field: { onChange, value } }) => (
            <FormItem className="w-full">
              <FormLabel className={clsx(form.formState.errors.user && 'text-red-500')}>
                Rechercher un technicien
              </FormLabel>
              <FormControl>
                <Popover open={technicianOpen} onOpenChange={setTechnicianOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={technicianOpen}
                      className="w-full justify-between"
                      disabled={user?.role === 'technician'}
                    >
                      {value || 'Sélectionner un technicien...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="popover-content-width-full p-0">
                    <Command className="w-full">
                      <CommandList className="w-full">
                        <CommandInput placeholder="Rechercher un technicien..." />
                        <CommandEmpty>Aucun technicien trouvé !</CommandEmpty>
                        <CommandGroup>
                          {loadingTechnicians && <CommandEmpty>Chargement...</CommandEmpty>}
                          {technicians?.map((technician: Technician) => (
                            <CommandItem
                              key={technician.username}
                              onSelect={(currentValue) => {
                                onChange(currentValue === value ? '' : currentValue);
                                setTechnicianOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  value === `${technician.firstName} ${technician.lastName}`
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {technician.firstName} {technician.lastName}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage>{form.formState.errors.user?.message}</FormMessage>
            </FormItem>
          )}
        />

        {/* Chantier */}
        <FormField
          control={form.control}
          name="chantierId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className={clsx(form.formState.errors.chantierId && 'text-red-500')}>
                Chantier
              </FormLabel>
              <FormControl>
                <Popover open={chantierOpen} onOpenChange={setChantierOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={chantierOpen}
                      className="w-full justify-between"
                    >
                      {field.value
                        ? chantiers?.find((c) => c.id === field.value)?.address ??
                          'Sélectionner un chantier...'
                        : 'Sélectionner un chantier...'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="popover-content-width-full p-0">
                    <Command className="w-full">
                      <CommandList className="w-full">
                        <CommandInput placeholder="Rechercher un chantier..." />
                        <CommandEmpty>Aucun chantier trouvé !</CommandEmpty>
                        <CommandGroup>
                          {loadingChantiers && <CommandEmpty>Chargement...</CommandEmpty>}
                          {chantiers?.map((chantier: Chantier) => (
                            <CommandItem
                              key={chantier.id}
                              value={`${chantier.address} ${chantier.internalAffaireNumber}`}
                              onSelect={() => {
                                field.onChange(chantier.id);
                                setChantierOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  field.value === chantier.id ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                              <span className="flex flex-col">
                                <span>{chantier.address}</span>
                                <span className="text-muted-foreground text-xs">
                                  {chantier.internalAffaireNumber} · {chantier.market?.name}
                                </span>
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage>{form.formState.errors.chantierId?.message}</FormMessage>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Créer la dérivation
        </Button>
      </form>
    </FormProvider>
  );
}
