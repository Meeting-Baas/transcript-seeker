import { fetchCalendars } from '@/lib/meetingbaas';
import useSWR from 'swr';

const fetcher = async (apiKey: string) => {
  const calendars = await fetchCalendars({ apiKey });
  if (!calendars) return [];
  return calendars;
};

function useCalendars({ baasApiKey }: { baasApiKey: string }) {
  const { data, error, isLoading } = useSWR(['calendars', baasApiKey], ([key, baasApiKey]) =>
    fetcher(baasApiKey),
  );

  return {
    calendars: data,
    isLoading,
    isError: error,
  };
}

export { useCalendars };
