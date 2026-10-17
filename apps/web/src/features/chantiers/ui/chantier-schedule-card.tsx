'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Chantier } from '@repo/types';
import {
  formatChantierSchedule,
  toDateInputValue,
  useUpdateChantierSchedule,
} from '@/entities/chantier';
import { getApiErrorMessage } from '@/shared/lib/api-error';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import {
  ChantierScheduleFormData,
  chantierScheduleSchema,
  toScheduleDto,
} from '../model/chantiers-admin.schema';
import { ChantierScheduleFields } from './chantier-schedule-fields';

interface ChantierScheduleCardProps {
  chantier: Chantier;
}

export function ChantierScheduleCard({ chantier }: ChantierScheduleCardProps) {
  const updateSchedule = useUpdateChantierSchedule(chantier.id);
  const form = useForm<ChantierScheduleFormData>({
    resolver: zodResolver(chantierScheduleSchema),
    values: {
      startDate: toDateInputValue(chantier.startDate),
      endDate: toDateInputValue(chantier.endDate),
    },
  });

  const onSubmit = (data: ChantierScheduleFormData) => {
    updateSchedule.mutate(toScheduleDto(data), {
      onSuccess: () => toast.success('Planning du chantier mis à jour'),
      onError: (error: Error) =>
        toast.error(
          getApiErrorMessage(error) ||
            'Une erreur est survenue lors de la mise à jour du planning'
        ),
    });
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Planning</CardTitle>
        <p className="text-muted-foreground text-sm">
          {formatChantierSchedule(chantier)}
        </p>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ChantierScheduleFields control={form.control} />
            <Button
              type="submit"
              disabled={!form.formState.isDirty || updateSchedule.isPending}
            >
              Enregistrer le planning
            </Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
