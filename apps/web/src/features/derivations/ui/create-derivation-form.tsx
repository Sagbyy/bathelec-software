'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Chantier, Role } from '@repo/types';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { NativeSelect } from '@/shared/ui/native-select';
import { useUserStore } from '@/entities/user';
import { useChantiers } from '@/entities/chantier';
import {
  createDerivationSchema,
  type CreateDerivation,
} from '@/entities/derivation';
import {
  formatMemberName,
  getTeamMembers,
  siteTeamQueries,
} from '@/entities/site-team';
import { useCreateDerivation } from '../model/use-derivation-assignment';

const parseOptionalId = (value: string) =>
  value === '' ? undefined : Number(value);

export function CreateDerivationForm() {
  const [chantierOpen, setChantierOpen] = useState(false);
  const { user } = useUserStore();
  const isTechnician = user?.role === Role.TECHNICIAN;

  const { data: teams, isLoading: loadingTeams } = useQuery(
    siteTeamQueries.visibleTo(user?.role)
  );
  const { data: chantiers, isLoading: loadingChantiers } = useChantiers();
  const createDerivation = useCreateDerivation();

  const form = useForm<CreateDerivation>({
    resolver: zodResolver(createDerivationSchema),
    defaultValues: {
      teamId: undefined,
      userId: undefined,
      chantierId: undefined,
    },
  });

  const selectedTeamId = form.watch('teamId');
  const members = getTeamMembers(teams, selectedTeamId);

  const onSubmit = (data: CreateDerivation) => {
    const payload = isTechnician && user ? { ...data, userId: user.id } : data;
    createDerivation.mutate(payload, { onSuccess: () => form.reset() });
  };

  return (
    <FormProvider {...form}>
      <form
        className="space-y-5 rounded-xl border bg-card p-4 shadow-card sm:p-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="teamId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel
                className={clsx(form.formState.errors.teamId && 'text-destructive')}
              >
                Équipe chantier
              </FormLabel>
              <FormControl>
                <NativeSelect
                  value={field.value ?? ''}
                  disabled={loadingTeams}
                  onChange={(event) => {
                    field.onChange(parseOptionalId(event.target.value));
                    form.setValue('userId', undefined);
                  }}
                >
                  <option value="">Sélectionner une équipe...</option>
                  {teams?.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </NativeSelect>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isTechnician && (
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Technicien (optionnel)</FormLabel>
                <FormControl>
                  <NativeSelect
                    value={field.value ?? ''}
                    disabled={selectedTeamId === undefined}
                    onChange={(event) =>
                      field.onChange(parseOptionalId(event.target.value))
                    }
                  >
                    <option value="">
                      À attribuer par le chef de chantier
                    </option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {formatMemberName(member)}
                      </option>
                    ))}
                  </NativeSelect>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="chantierId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel
                className={clsx(
                  form.formState.errors.chantierId && 'text-destructive'
                )}
              >
                Chantier
              </FormLabel>
              <FormControl>
                <Popover open={chantierOpen} onOpenChange={setChantierOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={chantierOpen}
                      className="w-full justify-between font-normal"
                    >
                      <span className="truncate">
                        {chantiers?.find((c) => c.id === field.value)
                          ?.address ?? 'Sélectionner un chantier...'}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="popover-content-width-full p-0">
                    <Command className="w-full">
                      <CommandList className="w-full">
                        <CommandInput placeholder="Rechercher un chantier..." />
                        <CommandEmpty>Aucun chantier trouvé !</CommandEmpty>
                        <CommandGroup>
                          {loadingChantiers && (
                            <CommandEmpty>Chargement...</CommandEmpty>
                          )}
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
                                  field.value === chantier.id
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              <span className="flex flex-col">
                                <span>{chantier.address}</span>
                                <span className="text-muted-foreground text-xs">
                                  {chantier.internalAffaireNumber} ·{' '}
                                  {chantier.market?.name}
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
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={createDerivation.isPending}
        >
          Créer la dérivation
        </Button>
      </form>
    </FormProvider>
  );
}
