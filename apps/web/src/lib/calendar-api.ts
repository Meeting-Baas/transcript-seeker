import { useApiKey } from '@/hooks/use-api-key';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
}

export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  const { apiKey } = useApiKey({ type: 'meetingbaas-calendar' });
  
  if (!apiKey) {
    throw new Error('Calendar API key not found');
  }

  const response = await fetch('https://api.meetingbaas.com/calendar/events', {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch calendar events');
  }

  return response.json();
}