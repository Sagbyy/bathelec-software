'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { CommandList } from 'cmdk';
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
} from '@/components/ui/form';
import clsx from 'clsx';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Technician } from '@repo/types';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { formSchema } from '@/validators/create-derivation.schema';
import { useUserStore } from '@/hooks/useUserStore';

const fetchTechnicians = async () => {
  const response = await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/users/technicians`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    })
    .then((res) => res.data);

  return response;
};

export default function CreateDerivationForm() {
  const [open, setOpen] = useState(false);
  const { user } = useUserStore();

  const {
    data: technicians,
    isLoading,
    isError,
  } = useQuery<Technician[]>({
    queryKey: ['technicians'],
    queryFn: fetchTechnicians,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: '',
      isBlank: false,
      address: '',
      postalCode: '',
      city: '',
    },
  });

  useEffect(() => {
    if (user) {
      const fullName = `${user.firstName} ${user.lastName}`;
      if (user.role === 'technician') {
        form.reset({
          ...form.getValues(),
          user: fullName,
        });
      }
    }
  }, [user, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const userId: number | undefined = technicians?.find(
      (technician) =>
        `${technician.firstName} ${technician.lastName}` === data.user
    )?.id;

    if (data.isBlank) {
      data.address = null;
      data.postalCode = null;
      data.city = null;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/derivations`,
        {
          userId,
          address: data.address,
          postalCode: data.postalCode ? Number(data.postalCode) : null,
          city: data.city,
          isBlank: data.isBlank,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        }
      );

      if (response.status !== 201) {
        throw new Error('Erreur lors de la création de la dérivation');
      }

      form.reset();

      toast.success('Dérivation créée avec succès');
    } catch (error) {
      toast.error("La dérivation n'a pas pu être créée");

      console.error(error);
    }
  };

  return (
    <>
      <FormProvider {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="user"
            render={({ field: { onChange, value } }) => (
              <FormItem className="w-full">
                <FormLabel
                  className={clsx(form.formState.errors.user && 'text-red-500')}
                >
                  Rechercher un technicien
                </FormLabel>
                <FormControl>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                        disabled={user?.role === 'technician'}
                      >
                        {value || 'Selectionner un technicien...'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="popover-content-width-full p-0">
                      <Command className="w-full">
                        <CommandList className="w-full">
                          <CommandInput placeholder="Rechercher un technicien..." />
                          <CommandEmpty>Aucun technicien trouvé !</CommandEmpty>
                          <CommandGroup>
                            {isLoading && (
                              <CommandEmpty>Chargement...</CommandEmpty>
                            )}
                            {isError && (
                              <CommandEmpty>Erreur de chargement</CommandEmpty>
                            )}
                            {technicians?.length === 0 ||
                            technicians === undefined ? (
                              <CommandEmpty>
                                Aucun technicien trouvé
                              </CommandEmpty>
                            ) : (
                              <>
                                {technicians.map((technician: Technician) => (
                                  <CommandItem
                                    key={technician.username}
                                    onSelect={(currentValue) => {
                                      onChange(
                                        currentValue === value
                                          ? ''
                                          : currentValue
                                      );
                                      setOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        value === technician.username
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    {technician.firstName} {technician.lastName}
                                  </CommandItem>
                                ))}
                              </>
                            )}
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

          <FormField
            control={form.control}
            name="isBlank"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={field.value as boolean}
                      onCheckedChange={field.onChange}
                      id="is-derivation-blank"
                    />
                    <Label htmlFor="is-derivation-blank">
                      Je souhaite créer un relevé de dérivation vide
                    </Label>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          {!form.watch('isBlank') && (
            <>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        placeholder="Entrer l'adresse"
                        className={clsx(
                          form.formState.errors.address && 'border-red-500'
                        )}
                        required
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.address?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code postal</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          type="text"
                          placeholder="Entrer le code postal"
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.postalCode?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          placeholder="Entrer la ville"
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.city?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}
          <Button type="submit" className="w-full">
            Créer la dérivation
          </Button>
        </form>
      </FormProvider>
    </>
  );
}
