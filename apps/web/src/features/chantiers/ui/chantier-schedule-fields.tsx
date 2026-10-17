'use client';

import { Control, FieldValues, Path } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';

type ScheduleFieldValues = FieldValues & {
  startDate: string;
  endDate: string;
};

interface ChantierScheduleFieldsProps<T extends ScheduleFieldValues> {
  control: Control<T>;
}

const SCHEDULE_FIELDS = [
  { name: 'startDate', label: 'Date de début prévue' },
  { name: 'endDate', label: 'Date de fin prévue (optionnel)' },
] as const;

export function ChantierScheduleFields<T extends ScheduleFieldValues>({
  control,
}: ChantierScheduleFieldsProps<T>) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {SCHEDULE_FIELDS.map(({ name, label }) => (
        <FormField
          key={name}
          control={control}
          name={name as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}
