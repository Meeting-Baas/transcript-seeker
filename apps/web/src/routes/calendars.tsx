import { Header } from '@/components/header';
import FullSpinner from '@/components/loader';
import { useApiKey } from '@/hooks/use-api-key';
import { useSession } from '@/lib/auth';
import { createCalendar, fetchCalendars } from '@/lib/meetingbaas';
import { useNavigate } from 'react-router-dom';

import { Separator } from '@meeting-baas/ui/separator';

import ErrorPage from './error';

function CalendarsPage() {
  const navigate = useNavigate();
  const { apiKey: baasApiKey, isLoading: isBaasApiKeyLoading } = useApiKey({ type: 'meetingbaas' });

  const {
    data: session,
    isPending: isSessionLoading,
    // error: sessionError,
  } = useSession();

  if (isSessionLoading || isBaasApiKeyLoading) return <FullSpinner />;

  // if (sessionError) return <ErrorPage>{sessionError?.message}</ErrorPage>;
  if (!session && !isSessionLoading) {
    navigate('/login');
    return;
  }

  if (!baasApiKey)
    return (
      <ErrorPage>
        The MeetingBaas API Key is not configured. Please set it up and try again.
      </ErrorPage>
    );

  createCalendar({
    platform: 'Google',
    apiKey: baasApiKey,
  });
  // fetchCalendars({
  //   apiKey: baasApiKey
  // });

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
        {/* <select
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
        /> */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Events:</h3>
          <ul>
            {/* {events.map((event) => (
              <li key={event.uuid}>
                {event.name} - {new Date(event.start_time.secs_since_epoch * 1000).toLocaleString()}
              </li>
            ))} */}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CalendarsPage;
