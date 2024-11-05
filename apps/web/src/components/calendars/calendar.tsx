'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar';
import { createCalendarControlsPlugin } from '@schedule-x/calendar-controls';
import { createCurrentTimePlugin } from '@schedule-x/current-time';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import { format } from 'date-fns';
import useSWR from 'swr';

// prettier-ignore
import '@schedule-x/theme-default/dist/index.css';
// prettier-ignore
import '@/styles/schedulex.css';

import type { ExtendedCalendarBaasEvent } from '@/types/calendar';
import type { CalendarEvent, Calendars } from '@/types/schedulex';
import { useApiKey } from '@/hooks/use-api-key';
import { scheduleCalendarEvent, unScheduleCalendarEvent } from '@/lib/meetingbaas';
import { toast } from 'sonner';

import type { CalendarBaasData } from '@meeting-baas/shared';
import { DEFAULT_BOT_IMAGE, DEFAULT_BOT_NAME, DEFAULT_ENTRY_MESSAGE } from '@meeting-baas/shared';

import CalendarToolbar from './calendar-toolbar';
import { EventModal } from './event-modal';

interface CalendarProps {
  calendarsData: CalendarBaasData[];
  initialEventsData: ExtendedCalendarBaasEvent[];
}

function Calendar({ calendarsData, initialEventsData }: CalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<ExtendedCalendarBaasEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { apiKey: baasApiKey } = useApiKey({ type: 'meetingbaas' });

  const { data: eventsData, mutate } = useSWR(
    ['calendar-events', calendarsData, baasApiKey],
    () => initialEventsData,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

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
      ? eventsData
          .map((event): CalendarEvent | null => {
            if (!event) return null;

            const startDate = new Date(event.start_time);
            const endDate = new Date(event.end_time);
            const attendees = event.raw.attendees.map((attendee) => attendee.email ?? '') ?? [];

            return {
              id: event.uuid,
              start: format(startDate, 'yyyy-MM-dd HH:mm'),
              end: format(endDate, 'yyyy-MM-dd HH:mm'),
              title: event.name,
              location: event.meeting_url,
              description: event.raw.description ?? '',
              people: attendees,
              calendarId: event.calendarId,
            };
          })
          .filter((event): event is CalendarEvent => event !== null)
      : [];
  }, [eventsData]);

  const dayView = createViewDay();
  const weekView = createViewWeek();
  const monthGridView = createViewMonthGrid();
  const monthAgendaView = createViewMonthAgenda();

  const calendar = useCalendarApp(
    {
      views: [dayView, weekView, monthGridView, monthAgendaView],
      defaultView: monthGridView.name,
      calendars: calendars,
      events: events,
      callbacks: {
        onEventClick(calendarEvent: CalendarEvent) {
          setSelectedEvent(eventsData?.find((event) => event.uuid === calendarEvent.id) ?? null);
          setIsModalOpen(true);
        },
      },
      isResponsive: false,
    },
    plugins,
  );

  useEffect(() => {
    calendar.eventsService.getAll();
  }, [calendar.eventsService]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  async function onRecordChange(event: ExtendedCalendarBaasEvent, enabled: boolean) {
    setIsProcessing(true);
    const optimisticData = eventsData?.map((e) =>
      e.uuid === event.uuid ? { ...e, bot_param: enabled ? { enabled: true } : null } : e,
    );

    try {
      await mutate(
        async () => {
          if (enabled) {
            await scheduleCalendarEvent({
              apiKey: baasApiKey ?? '',
              eventId: event.uuid,
              botName: DEFAULT_BOT_NAME,
              botImage: DEFAULT_BOT_IMAGE,
              enterMessage: DEFAULT_ENTRY_MESSAGE,
            });
          } else {
            await unScheduleCalendarEvent({
              apiKey: baasApiKey ?? '',
              eventId: event.uuid,
            });
          }
          return optimisticData;
        },
        {
          optimisticData,
          rollbackOnError: true,
          populateCache: true,
          revalidate: false,
        },
      );

      setSelectedEvent((prev) =>
        prev?.uuid === event.uuid
          ? { ...prev, bot_param: enabled ? { enabled: true } : null }
          : prev,
      );

      toast.success('Event recording status updated successfully');
    } catch (error) {
      console.error('Failed to toggle recording:', error);
      toast.error('Failed to update event recording status');
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="flex h-full w-full flex-col">
      <CalendarToolbar calendarApp={calendar} />
      <ScheduleXCalendar calendarApp={calendar} />
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onRecordChange={onRecordChange}
        isProcessing={isProcessing}
      />
    </div>
  );
}

export default Calendar;
