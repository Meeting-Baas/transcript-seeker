import { useEffect, useMemo } from 'react';
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar';

import { createEventModalPlugin } from '@schedule-x/event-modal'
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';

import '@schedule-x/theme-default/dist/index.css';
import '@/styles/schedulex.css';

import { CalendarBaasData, CalendarBaasEvent } from "@meeting-baas/shared";
import { CalendarEvent, Calendars } from '@/types/schedulex';

interface CalendarProps {
  calendarsData: CalendarBaasData[];
  eventsData: CalendarBaasEvent[];
}

function Calendar({ calendarsData, eventsData }: CalendarProps) {
  const calendars: Calendars = useMemo(() => {
    return calendarsData.reduce((acc, calendar) => {
      acc[calendar.uuid] = {
        colorName: calendar.name,
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
  console.log(calendars)

  const events: CalendarEvent[] = useMemo(() => {
    return eventsData.map(event => ({
      id: event.google_id,
      start: new Date(event.start_time.secs_since_epoch * 1000).toISOString(),
      end: new Date(event.end_time.secs_since_epoch * 1000).toISOString(),
      title: event.name,
      location: event.meeting_url,
      // todo: type raw data
      description: event.raw?.description,
      people: event.raw?.attendees.map((attendee: { email?: string }) => attendee?.email),
      calendarId: event.uuid,
    }));
  }, [eventsData]);

  const plugins = [createEventsServicePlugin(), createEventModalPlugin()];
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
  }, [calendar.eventsService]);

  // Example of how you might use raw event data
  // useEffect(() => {
  //   if (eventsData.length > 0) {
  //     console.log('Raw event data:', events);
  //     // You can perform any additional processing or use raw data here
  //   }
  // }, [eventsData]);

  return <ScheduleXCalendar calendarApp={calendar} />;
}

export default Calendar;
