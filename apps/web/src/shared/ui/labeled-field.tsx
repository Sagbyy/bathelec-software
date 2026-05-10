import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { Control, ControllerRenderProps, FieldValues, Path } from 'react-hook-form';

interface LabeledFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  required?: boolean;
  itemClassName?: string;
  children: (field: ControllerRenderProps<T, Path<T>>) => React.ReactNode;
}

export function LabeledField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  itemClassName,
  children,
}: LabeledFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={itemClassName}>
          <FormLabel>
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </FormLabel>
          <FormControl>{children(field)}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
