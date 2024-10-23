import { Header } from '@/components/header';
import { fetchCalendarEvents } from '@/lib/calendar-api';
import { Calendar } from '@meeting-baas/ui/calendar';
import { Separator } from '@meeting-baas/ui/separator';
import { useState } from 'react';
import useSWR from 'swr';

function CalendarsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { data: events, error } = useSWR('/api/calendar', fetchCalendarEvents);

  if (error) return <div>Failed to load calendar events</div>;
  if (!events) return <div>Loading...</div>;

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
          <p className="text-muted-foreground">
            View and manage your calendar events.
          </p>
        </div>
        <Separator className="my-4" />
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => setDate(newDate)}
          className="rounded-md border"
        />
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Events:</h3>
          <ul>
            {events.map((event) => (
              <li key={event.id}>{event.title} - {new Date(event.start).toLocaleString()}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CalendarsPage;