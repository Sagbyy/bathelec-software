'use client';

import * as React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/popover';
import { ScrollArea, ScrollBar } from '@/shared/ui/scroll-area';
import { ControllerRenderProps } from 'react-hook-form';
import { fr } from 'date-fns/locale';
import type { CreateCompletedDerivation } from '@/entities/derivation';

interface DateTimePicker24hProps {
  field: ControllerRenderProps<CreateCompletedDerivation>;
}

export function DateTimePicker24h({ field }: DateTimePicker24hProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const date = field.value ? new Date(field.value) : undefined;

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleDateSelect = (selectedDate?: Date) => {
    if (selectedDate) {
      field.onChange(selectedDate.toISOString());
    }
  };

  const handleTimeChange = (type: 'hour' | 'minute', value: string) => {
    if (date) {
      const newDate = new Date(date);
      if (type === 'hour') {
        newDate.setHours(parseInt(value));
      } else if (type === 'minute') {
        newDate.setMinutes(parseInt(value));
      }
      field.onChange(newDate.toISOString());
      console.log(newDate.toISOString());
      console.log(newDate);
      console.log(new Date(newDate.toISOString()));
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild disabled={field.disabled}>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, 'dd/MM/yyyy HH:mm', { locale: fr })
          ) : (
            <span>DD/MM/YYYY HH:mm</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
          <div className="flex flex-col sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
            <div className="flex flex-col border-t pt-2 sm:border-l sm:border-t-0">
              <p className="text-center text-sm font-medium sm:px-2">Heures</p>
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex p-2 sm:flex-col">
                  {hours.reverse().map((hour) => (
                    <Button
                      key={hour}
                      size="icon"
                      variant={
                        date && date.getHours() === hour ? 'default' : 'ghost'
                      }
                      className="aspect-square shrink-0 sm:w-full"
                      onClick={() => handleTimeChange('hour', hour.toString())}
                    >
                      {hour}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
            </div>
            <div className="flex flex-col border-t pt-2 sm:border-t-0">
              <p className="text-center text-sm font-medium sm:px-2">Minutes</p>
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex p-2 sm:flex-col">
                  {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                    <Button
                      key={minute}
                      size="icon"
                      variant={
                        date && date.getMinutes() === minute
                          ? 'default'
                          : 'ghost'
                      }
                      className="aspect-square shrink-0 sm:w-full"
                      onClick={() =>
                        handleTimeChange('minute', minute.toString())
                      }
                    >
                      {minute.toString().padStart(2, '0')}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
