import { CalendarControlsPluginType } from '@/types/schedulex';
import type { CalendarApp } from '@schedule-x/calendar';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

import CalendarControls from './calendar-controls';
import CalendarNavigation from './calendar-navigation';

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

  useEffect(() => {
    calendarApp.calendarControls.setView(view);
  }, [view, calendarApp.calendarControls]);

  return (
    <header className="flex h-16 w-full shrink-0 items-center justify-between gap-2 overflow-auto border-b px-4">
      <CalendarNavigation calendar={calendarApp} date={date} setDate={setDate} view={view} />
      <CalendarControls
        calendar={calendarApp}
        date={date}
        setDate={setDate}
        view={view}
        setView={setView}
      />
    </header>
  );
}

export default CalendarToolbar;
