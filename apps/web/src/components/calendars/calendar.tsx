import { useEffect } from 'react';
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';

import '@schedule-x/theme-default/dist/index.css';
import '@/styles/schedulex.css';

import { CalendarEvent as CalendarEventT, Calendars as CalendarsT } from '@/types/schedulex';
import { useTheme } from 'next-themes';

interface CalendarProps {
  calendars?: CalendarsT;
  events: CalendarEventT[];
}

function Calendar({ calendars, events }: CalendarProps) {
  // const { resolvedTheme } = useTheme();
  const plugins = [createEventsServicePlugin()];

  const calendar = useCalendarApp(
    {
      views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
      calendars: calendars,
      events: events,
    },
    plugins,
  );

  useEffect(() => {
    // get all events
    calendar.eventsService.getAll();
  }, []);

  // useEffect(() => {
  //   if (resolvedTheme) calendar.setTheme(resolvedTheme);
  // }, [resolvedTheme])

  return <ScheduleXCalendar calendarApp={calendar} />;
}

export default Calendar;
