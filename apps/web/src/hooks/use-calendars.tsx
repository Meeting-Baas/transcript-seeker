import { fetchCalendars } from '@/lib/meetingbaas';
import useSWR from 'swr';

import { CalendarBaasData } from '@meeting-baas/shared';

interface UseCalendarsOptions {
  apiKey?: string | null;
}

const fetcher = async (apiKey: string): Promise<CalendarBaasData[] | null> => {
  if (!apiKey) return null;
  const calendars = await fetchCalendars({ apiKey });
  return calendars || [];
};

export function useCalendars({ apiKey }: UseCalendarsOptions) {
  const { data, error, isLoading, mutate } = useSWR(
    apiKey ? ['calendars', apiKey] : null,
    ([, apiKey]) => fetcher(apiKey),
  );

  return {
    calendars: data,
    isLoading,
    isError: error,
    mutate,
  };
}
