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
import { useState } from 'react';
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

const users = [
  { value: 'alice', label: 'Alice Johnson' },
  { value: 'bob', label: 'Bob Smith' },
  { value: 'charlie', label: 'Charlie Brown' },
  { value: 'david', label: 'David Lee' },
  { value: 'emma', label: 'Emma Watson' },
];

export default function CreateDerivationForm() {
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    user: z
      .string()
      .min(2, {
        message: "Le nom d'utilisateur doit comporter au moins 2 caractères",
      })
      .max(50, {
        message: "Le nom d'utilisateur ne peut pas dépasser 50 caractères",
      }),

    address: z
      .string()
      .min(5, { message: "L'adresse doit comporter au moins 5 caractères" })
      .max(100, { message: "L'adresse ne peut pas dépasser 100 caractères" }),

    postalCode: z.string().min(2, {
      message: 'Le code postal doit comporter au moins 2 caractères',
    }),

    city: z
      .string()
      .min(2, {
        message: 'Le nom de la ville doit comporter au moins 2 caractères',
      })
      .max(50, {
        message: 'Le nom de la ville ne peut pas dépasser 50 caractères',
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: '',
      address: '',
      postalCode: '',
      city: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
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
                            {users.map((user) => (
                              <CommandItem
                                key={user.value}
                                onSelect={(currentValue) => {
                                  onChange(
                                    currentValue === value ? '' : currentValue
                                  );
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    value === user.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                                {user.label}
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

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input
                    {...field}
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
                    <Input {...field} placeholder="Entrer le code postal" />
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
                    <Input {...field} placeholder="Entrer la ville" />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.city?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </FormProvider>
    </>
  );
}
