import { fetchCalendarEvents } from '@/lib/meetingbaas';
import useSWR from 'swr';

import { CalendarBaasData } from '@meeting-baas/shared';

interface UseCalendarEventsProps {
  calendars?: CalendarBaasData[] | null;
  apiKey?: string | null;
}

const fetcher = async (calendars: CalendarBaasData[], apiKey: string) => {
  const eventsPromises = calendars.map((calendar) =>
    fetchCalendarEvents({ calendarId: calendar.uuid, offset: 0, limit: 100, apiKey }),
  );
  const eventsResults = await Promise.all(eventsPromises);
  return eventsResults.flat();
};

export function useCalendarEvents({ calendars, apiKey }: UseCalendarEventsProps) {
  const {
    data: events,
    error,
    isLoading,
  } = useSWR(calendars && apiKey ? [calendars, apiKey] : null, ([calendarsArg, apiKeyArg]) =>
    fetcher(calendarsArg, apiKeyArg),
  );

  return {
    events,
    isLoading,
    isError: !!error,
  };
}
