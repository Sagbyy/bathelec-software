'use client';

import { MinusIcon, PlusIcon } from 'lucide-react';
import * as React from 'react';

import {
  Button,
  Group,
  Input,
  Label,
  NumberField,
} from 'react-aria-components';

interface InputWithPlusMinusButtonsRoundedProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'value' | 'defaultValue'
  > {
  label?: string;
  value?: number | string;
  defaultValue?: number | string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
}

const InputWithPlusMinusButtonsRounded = React.forwardRef<
  HTMLInputElement,
  InputWithPlusMinusButtonsRoundedProps
>(
  (
    {
      value,
      defaultValue,
      onChange,
      disabled,
      placeholder,
      name,
      onBlur,
      step,
      ...props
    },
    ref
  ) => {
    const numberValue =
      value !== undefined
        ? typeof value === 'string'
          ? Number.parseFloat(value) || 0
          : value
        : undefined;
    const numberDefaultValue =
      defaultValue !== undefined
        ? typeof defaultValue === 'string'
          ? Number.parseFloat(defaultValue) || 0
          : defaultValue
        : undefined;
    const numberStep =
      step !== undefined
        ? typeof step === 'string'
          ? Number.parseFloat(step) || undefined
          : step
        : undefined;

    const handleChange = (val: number | null) => {
      if (onChange) {
        const syntheticEvent = {
          target: { value: val?.toString() || '0' },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    // Filtrer les props qui ne sont pas compatibles avec NumberField
    const { type, min, max, ...numberFieldProps } = props as Record<
      string,
      unknown
    >;

    return (
      <NumberField
        value={numberValue}
        defaultValue={numberDefaultValue}
        onChange={handleChange}
        isDisabled={disabled}
        name={name}
        step={numberStep}
        minValue={
          min !== undefined
            ? typeof min === 'string'
              ? Number.parseFloat(min) || undefined
              : (min as number)
            : undefined
        }
        maxValue={
          max !== undefined
            ? typeof max === 'string'
              ? Number.parseFloat(max) || undefined
              : (max as number)
            : undefined
        }
        {...numberFieldProps}
      >
        <Label className="flex select-none items-center gap-2 text-sm font-medium leading-none">
          {props.label}
        </Label>
        <Group className="dark:bg-input/30 border-input data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive shadow-xs data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focus-within:ring-[3px] relative inline-flex h-9 w-full min-w-0 items-center overflow-hidden whitespace-nowrap rounded-md border bg-transparent text-base outline-none transition-[color,box-shadow] md:text-sm">
          <Button
            slot="decrement"
            className="border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground ml-2 flex aspect-square h-5 items-center justify-center rounded-sm border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MinusIcon className="size-3" />
            <span className="sr-only">Décrémenter</span>
          </Button>
          <Input
            ref={ref}
            placeholder={placeholder}
            onBlur={onBlur}
            className="selection:bg-primary selection:text-primary-foreground w-full grow px-3 py-2 text-center tabular-nums outline-none"
          />
          <Button
            slot="increment"
            className="border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground mr-2 flex aspect-square h-5 items-center justify-center rounded-sm border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <PlusIcon className="size-3" />
            <span className="sr-only">Incrémenter</span>
          </Button>
        </Group>
      </NumberField>
    );
  }
);

InputWithPlusMinusButtonsRounded.displayName =
  'InputWithPlusMinusButtonsRounded';

export default InputWithPlusMinusButtonsRounded;
