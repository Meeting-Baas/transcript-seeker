import type { ExtendedCalendarBaasEvent } from '@/types/calendar';
import { fetchCalendarEvents } from '@/lib/meetingbaas';
import useSWR from 'swr';

import type { CalendarBaasData } from '@meeting-baas/shared';

interface UseCalendarEventsProps {
  calendars?: CalendarBaasData[] | null;
  apiKey?: string | null;
}

const fetcher = async (
  calendars: CalendarBaasData[],
  apiKey: string,
): Promise<ExtendedCalendarBaasEvent[]> => {
  const eventsPromises = calendars.map(
    (calendar) =>
      new Promise(async (resolve, reject) => {
        try {
          const events = (await fetchCalendarEvents({
            calendarId: calendar.uuid,
            offset: 0,
            limit: 100,
            apiKey,
          })) as ExtendedCalendarBaasEvent[] | null;

          events?.forEach((event) => {
            event.calendarId = calendar.uuid;
          });

          resolve(events);
        } catch (error) {
          reject(error);
        }
      }),
  );

  const eventsResults: ExtendedCalendarBaasEvent[] = await Promise.all(eventsPromises);
  return eventsResults.flat();
};

export function useCalendarEvents({ calendars, apiKey }: UseCalendarEventsProps) {
  const { data, error, isLoading, mutate } = useSWR(
    calendars && apiKey ? ['calendar-events', calendars, apiKey] : null,
    ([, calendarsArg, apiKeyArg]) => fetcher(calendarsArg, apiKeyArg),
  );

  return {
    events: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}
