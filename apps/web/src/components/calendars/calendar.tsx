import { useEffect, useMemo } from 'react';
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar';
import { createCalendarControlsPlugin } from '@schedule-x/calendar-controls';
import { createCurrentTimePlugin } from '@schedule-x/current-time';
import { createEventModalPlugin } from '@schedule-x/event-modal';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import { format } from 'date-fns';

import '@schedule-x/theme-default/dist/index.css';
import '@/styles/schedulex.css';

import { ExtendedCalendarBaasEvent } from '@/types/calendar';
import { CalendarEvent, Calendars } from '@/types/schedulex';

import { CalendarBaasData } from '@meeting-baas/shared';
import CalendarToolbar from './calendar-toolbar';

interface CalendarProps {
  calendarsData: CalendarBaasData[];
  eventsData: ExtendedCalendarBaasEvent[];
}

function Calendar({ calendarsData, eventsData }: CalendarProps) {
  const calendarControls = createCalendarControlsPlugin();
  const plugins = [
    createEventsServicePlugin(),
    createCurrentTimePlugin({ fullWeekWidth: true }),
    calendarControls,
  ];

  const calendars: Calendars = useMemo(() => {
    return calendarsData.reduce((acc, calendar) => {
      acc[calendar.uuid] = {
        colorName: calendar.uuid,
        lightColors: {
          main: '#f9d71c',
          container: '#fff5aa',
          onContainer: '#594800',
        },
        darkColors: {
          main: '#fff5c0',
          onContainer: '#fff5de',
          container: '#a29742',
        },
        label: calendar.name,
      };
      return acc;
    }, {} as Calendars);
  }, [calendarsData]);

  const events: CalendarEvent[] = useMemo(() => {
    return eventsData
      .map((event): CalendarEvent | null => {
        if (!event) return null;

        const startDate = new Date(event.start_time.secs_since_epoch * 1000);
        const endDate = new Date(event.end_time.secs_since_epoch * 1000);
        const attendees = event.raw?.attendees?.map((attendee) => attendee?.email ?? '') ?? [];

        return {
          id: event.uuid,
          start: format(startDate, 'yyyy-MM-dd HH:mm'),
          end: format(endDate, 'yyyy-MM-dd HH:mm'),
          title: event.name,
          location: event.meeting_url,
          description: event.raw?.description ?? '',
          people: attendees,
          calendarId: event.calendarId,
        };
      })
      .filter((event): event is CalendarEvent => event !== null);
  }, [eventsData]);

  const calendar = useCalendarApp(
    {
      views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
      calendars: calendars,
      events: events,
      callbacks: {
        onEventClick(calendarEvent) {
          console.log('onEventClick', calendarEvent) 
        },
      },
      isResponsive: false
    },
    plugins,
  );

  useEffect(() => {
    // get all events
    calendar.eventsService.getAll();
  }, [calendar.eventsService]);

  // Example of how you might use raw event data
  // useEffect(() => {
  //   if (eventsData.length > 0) {
  //     console.log('Raw event data:', eventsData);
  //     // You can perform any additional processing or use raw data here
  //   }
  // }, [eventsData]);

  return (
    <div className="flex h-full w-full flex-col">
      <CalendarToolbar calendarApp={calendar} />
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}

export default Calendar;
