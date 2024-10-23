import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { useApiKey } from '@/hooks/use-api-key';
import { createCalendar, fetchCalendarEvents, fetchCalendars } from '@/lib/meetingbaas';
import ErrorPage from '@/routes/error';
import { endOfMonth, startOfMonth } from 'date-fns';
import { Calendar } from 'lucide-react';

import { CalendarBaasData, CalendarBaasEvent } from '@meeting-baas/shared';
import { Separator } from '@meeting-baas/ui/separator';

function CalendarsPage() {
  const { apiKey: baasApiKey } = useApiKey({ type: 'meetingbaas' });
  const { apiKey: googleRefreshToken } = useApiKey({ type: 'google-refresh-token' });

  const [date, setDate] = useState<Date>(new Date());
  const [calendars, setCalendars] = useState<CalendarBaasData[]>([]);
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarBaasEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!baasApiKey) return;
    if (!googleRefreshToken) return;

    async function initializeCalendars() {
      try {
        const fetchedCalendars = await fetchCalendars({ apiKey: baasApiKey });
        if (fetchedCalendars?.length === 0) {
          const newCalendar = await createCalendar({ googleClientId, googleClientSecret, googleRefreshToken });
          setCalendars([newCalendar]);
          setSelectedCalendar(newCalendar.uuid);
        } else {
          setCalendars(fetchedCalendars);
          setSelectedCalendar(fetchedCalendars[0].uuid);
        }
      } catch (err) {
        setError('Failed to initialize calendars');
      } finally {
        setLoading(false);
      }
    }

    initializeCalendars();
  }, [baasApiKey]);

  useEffect(() => {
    async function fetchEvents() {
      if (selectedCalendar) {
        try {
          const startDate = startOfMonth(date);
          const endDate = endOfMonth(date);
          const fetchedEvents = await fetchCalendarEvents(selectedCalendar, 0, 100);
          setEvents(
            fetchedEvents.filter(
              (event) =>
                new Date(event.start_time.secs_since_epoch * 1000) >= startDate &&
                new Date(event.end_time.secs_since_epoch * 1000) <= endDate,
            ),
          );
        } catch (err) {
          setError('Failed to fetch calendar events');
        }
      }
    }

    fetchEvents();
  }, [selectedCalendar, date]);

  if (loading) return <div>Loading...</div>;
  if (error) return <ErrorPage>{error}</ErrorPage>;

  return (
    <div className="h-full min-h-[calc(100dvh-81px)]">
      <Header
        path={[
          {
            name: 'Calendars',
          },
        ]}
      />
      <div className="container p-4">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Calendars</h2>
          <p className="text-muted-foreground">View and manage your calendar events.</p>
        </div>
        <Separator className="my-4" />
        <select
          value={selectedCalendar || ''}
          onChange={(e) => setSelectedCalendar(e.target.value)}
          className="mb-4 rounded border p-2"
        >
          {calendars.map((calendar) => (
            <option key={calendar.uuid} value={calendar.uuid}>
              {calendar.name}
            </option>
          ))}
        </select>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => newDate && setDate(newDate)}
          className="rounded-md border"
        />
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Events:</h3>
          <ul>
            {events.map((event) => (
              <li key={event.uuid}>
                {event.name} - {new Date(event.start_time.secs_since_epoch * 1000).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CalendarsPage;
