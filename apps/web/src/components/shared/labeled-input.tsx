import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Control, FieldValues, Path } from 'react-hook-form';

interface LabeledInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  type?: string;
  transform?: (value: string) => string;
}

export function LabeledInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled,
  required,
  type = 'text',
  transform,
}: LabeledInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              {...field}
              onChange={
                transform
                  ? (e) => field.onChange(transform(e.target.value))
                  : field.onChange
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
