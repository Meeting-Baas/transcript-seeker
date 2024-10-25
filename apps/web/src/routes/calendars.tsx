import { AppSidebar } from '@/components/calendars/app-sidebar';
import Calendar from '@/components/calendars/calendar';
import { NoCalendars } from '@/components/calendars/no-calendars';
import FullSpinner from '@/components/loader';
import { ModeToggle } from '@/components/mode-toggle';
import { useApiKey } from '@/hooks/use-api-key';
import { useCalendarEvents } from '@/hooks/use-calendar-events';
import { useCalendars } from '@/hooks/use-calendars';
import { useSession } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@meeting-baas/ui/breadcrumb';
import { Separator } from '@meeting-baas/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@meeting-baas/ui/sidebar';

import ErrorPage from '@/routes/error';

export default function CalendarsPage() {
  const navigate = useNavigate();
  const { data: session, isPending: isSessionLoading } = useSession();
  const { apiKey: baasApiKey, isLoading: isBaasApiKeyLoading } = useApiKey({ type: 'meetingbaas' });
  const { calendars, isLoading: isCalendarsLoading } = useCalendars({
    key: baasApiKey ? ['calendars', baasApiKey] : null,
  });
  const { events, isLoading: isEventsLoading } = useCalendarEvents({
    calendars,
    apiKey: baasApiKey,
  });

  const isLoading =
    isSessionLoading || isBaasApiKeyLoading || isCalendarsLoading || isEventsLoading;

  if (isLoading) {
    return <FullSpinner />;
  }

  if (!session) {
    navigate('/login');
    return null;
  }

  if (!baasApiKey) {
    return (
      <ErrorPage>
        The MeetingBaas API Key is not configured. Please set it up and try again.
      </ErrorPage>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar calendars={calendars} />
      <SidebarInset className="w-full">
        <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Calendars</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex flex-1 justify-end">
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="h-full w-full flex-1 overflow-hidden">
            {calendars && calendars.length > 0 ? (
              <Calendar calendarsData={calendars} eventsData={events ?? []} />
            ) : (
              <NoCalendars />
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
