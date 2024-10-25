'use client';

import { Header } from '@/components/header';
import FullSpinner from '@/components/loader';
import { useApiKey } from '@/hooks/use-api-key';
import { useCalendars } from '@/hooks/use-calendars';
import { useSession } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

import { Separator } from '@meeting-baas/ui/separator';
import Calendar from '@/components/calendar';

export default function CalendarsPage() {
  const navigate = useNavigate();
  const { data: session, isPending: isSessionLoading } = useSession();
  const { apiKey: baasApiKey, isLoading: isBaasApiKeyLoading } = useApiKey({ type: 'meetingbaas' });
  const { calendars, isLoading: isCalendarsLoading } = useCalendars({
    key: baasApiKey ? ['calendars', baasApiKey] : null,
  });

  const isLoading = isSessionLoading || isBaasApiKeyLoading || isCalendarsLoading;
  if (isLoading) {
    return <FullSpinner />;
  }

  if (!session) {
    return navigate('/login');
  }

  if (!baasApiKey) {
    return (
      <div className="container p-4">
        <p className="text-red-500">
          The MeetingBaas API Key is not configured. Please set it up and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-[calc(100dvh-81px)]">
      <Header
        path={[
          {
            name: 'Calendars',
          },
        ]}
      />
      <div className="p-4 flex flex-col flex-1">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Calendars</h2>
          <p className="text-muted-foreground">View and manage your calendar events.</p>
        </div>
        <Separator className="my-4" />
        <div className="mt-4 w-full h-full flex-1 overflow-hidden">
          {/* {calendars?.length > 0 ? (
            <>
              <h3 className="text-lg font-semibold">Calendars:</h3>
              <ul>
                {calendars.map((calendar) => (
                  <li key={calendar.uuid}>
                    {calendar.name} - {calendar.uuid}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              Nothing here yet...
            </>
          )} */}
          <Calendar events={[]} />
        </div>
      </div>
    </div>
  );
}
