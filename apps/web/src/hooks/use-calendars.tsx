import { fetchCalendars } from '@/lib/meetingbaas';
import useSWR from 'swr';

import { CalendarBaasData } from '@meeting-baas/shared';

interface UseCalendarsOptions {
  key: [string, string] | null;
  enabled?: boolean;
}

const fetcher = async (apiKey: string): Promise<CalendarBaasData[] | null> => {
  if (!apiKey) return null;
  const calendars = await fetchCalendars({ apiKey });
  return calendars || [];
};

export function useCalendars({ key }: UseCalendarsOptions) {
  const { data, error, isLoading } = useSWR(
    key,
    ([, apiKey]) => fetcher(apiKey),
  );

  return {
    calendars: data,
    isLoading,
    isError: error,
  };
}
