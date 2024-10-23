import { useApiKey } from '@/hooks/use-api-key';

export type CalendarBaas = {
  google_id: string;
  name: string;
  email: string;
  resource_id: string | null;
  uuid: string;
};

export type CalendarBaasEvent = {
  google_id: string;
  name: string;
  meeting_url: string;
  start_time: {
    secs_since_epoch: number;
    nanos_since_epoch: number;
  };
  end_time: {
    secs_since_epoch: number;
    nanos_since_epoch: number;
  };
  is_organizer: boolean;
  recurring_event_id: string | null;
  is_recurring: boolean;
  uuid: string;
  raw: any;
  bot_param: any | null;
};

export async function createCalendar(): Promise<CalendarBaas> {
  const { apiKey: clientId } = useApiKey({ type: 'google-client-id' });
  const { apiKey: clientSecret } = useApiKey({ type: 'google-client-secret' });
  const { apiKey: refreshToken } = useApiKey({ type: 'google-refresh-token' });
  const { apiKey: baasApiKey } = useApiKey({ type: 'meetingbaas' });

  if (!clientId || !clientSecret || !refreshToken || !baasApiKey) {
    throw new Error('Missing required OAuth credentials');
  }

  const response = await fetch('https://api.meetingbaas.com/calendars', {
    method: 'POST',
    headers: {
      'x-spoke-api-key': `Bearer ${baasApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      oauth_client_id: clientId,
      oauth_client_secret: clientSecret,
      oauth_refresh_token: refreshToken,
      platform: 'Google',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create calendar');
  }

  const data = await response.json();
  return data.calendar;
}

export async function fetchCalendars(): Promise<CalendarBaas[]> {
  const { apiKey: meetingbaasApiKey } = useApiKey({ type: 'meetingbaas' });

  if (!meetingbaasApiKey) {
    throw new Error('Missing MeetingBaas API key');
  }

  const response = await fetch('https://api.meetingbaas.com/calendars', {
    headers: {
      'Authorization': `Bearer ${meetingbaasApiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch calendars');
  }

  return response.json();
}

export async function fetchCalendarEvents(calendarId: string, offset: number = 0, limit: number = 100): Promise<CalendarBaasEvent[]> {
  const { apiKey: meetingbaasApiKey } = useApiKey({ type: 'meetingbaas' });

  if (!meetingbaasApiKey) {
    throw new Error('Missing MeetingBaas API key');
  }

  const response = await fetch(`https://api.meetingbaas.com/calendar_events?calendar_id=${calendarId}&offset=${offset}&limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${meetingbaasApiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch calendar events');
  }

  return response.json();
}