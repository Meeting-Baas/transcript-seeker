import type { CalendarApp } from '@schedule-x/calendar';
import { useEffect, useState } from 'react';
import { CalendarControlsPluginType } from '@/types/schedulex';
import { format, getDate, isAfter, parseISO } from 'date-fns';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';

import CalendarNavigation from './calendar-navigation';
import CalendarControls from './calendar-controls';

interface CalendarToolbarProps {
  calendarApp: CalendarApp & {
    calendarControls: CalendarControlsPluginType;
  };
}

function CalendarToolbar({ calendarApp }: CalendarToolbarProps) {
  const [view, setView] = useState<string>(calendarApp.calendarControls.getView());
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    if (!date) return;
    const stringDate = format(date, 'yyyy-MM-dd');
    calendarApp.calendarControls.setDate(stringDate);
  }, [date]);

  return (
    <header className="flex h-16 w-full shrink-0 items-center justify-between gap-2 border-b px-4 overflow-auto">
      <CalendarNavigation calendar={calendarApp} date={date} setDate={setDate} />
      <CalendarControls calendar={calendarApp} date={date} setDate={setDate} />
    </header>
  );
}


export default CalendarToolbar;
