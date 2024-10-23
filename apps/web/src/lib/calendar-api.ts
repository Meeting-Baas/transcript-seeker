import { useApiKey } from '@/hooks/use-api-key';

interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  // Add other fields as needed
}

export async function fetchCalendarEvents(startDate: string, endDate: string): Promise<CalendarEvent[]> {
  const { apiKey } = useApiKey({ type: 'meetingbaas-calendar' });
  
  if (!apiKey) {
    throw new Error('Calendar API key not found');
  }

  const response = await fetch(`https://api.meetingbaas.com/calendar/calendar_events?start_date=${startDate}&end_date=${endDate}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch calendar events');
  }

  const data = await response.json();
  return data.items; // The API returns events in the 'items' array
}
