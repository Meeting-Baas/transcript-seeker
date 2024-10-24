import { fetchCalendars } from '@/lib/meetingbaas'
import { CalendarBaasData } from '@meeting-baas/shared'
import useSWR from 'swr'

interface UseCalendarsOptions {
  baasApiKey: string
  enabled?: boolean
}

const fetcher = async (apiKey: string): Promise<CalendarBaasData[]> => {
  if (!apiKey) {
    throw new Error('API key is required')
  }
  const calendars = await fetchCalendars({ apiKey })
  return calendars || []
}

export function useCalendars({ baasApiKey, enabled = true }: UseCalendarsOptions) {
  const { data, error, isLoading } = useSWR(
    enabled ? ['calendars', baasApiKey] : null,
    ([, apiKey]) => fetcher(apiKey),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  )

  return {
    calendars: data,
    isLoading,
    isError: error,
  }
}