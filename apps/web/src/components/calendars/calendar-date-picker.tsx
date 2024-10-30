'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@meeting-baas/ui';
import { Button } from '@meeting-baas/ui/button';
import { Calendar } from '@meeting-baas/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@meeting-baas/ui/popover';

interface CalendarDatePicker {
  className: string;
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

function CalendarDatePicker({ className, date, setDate }: CalendarDatePicker) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => (newDate ? setDate(newDate) : setDate(date))}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export default CalendarDatePicker;
