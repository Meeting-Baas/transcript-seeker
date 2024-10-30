'use client';

import { useCallback, useTransition } from 'react';
import { AppSidebar } from '@/components/calendars/app-sidebar';
import Calendar from '@/components/calendars/calendar';
import { NoCalendars } from '@/components/calendars/no-calendars';
import FullSpinner from '@/components/loader';
import { ModeToggle } from '@/components/mode-toggle';
import { useApiKey } from '@/hooks/use-api-key';
import { useCalendarEvents } from '@/hooks/use-calendar-events';
import { useCalendars } from '@/hooks/use-calendars';
import { useSession } from '@/lib/auth';
import { deleteCalendar as deleteCalendarApi } from '@/lib/meetingbaas';
import ErrorPage from '@/routes/error';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
import { Skeleton } from '@meeting-baas/ui/skeleton';

export default function CalendarsPage() {
  const navigate = useNavigate();
  const { data: session, isPending: isSessionLoading, error: sessionError } = useSession();
  const { apiKey: baasApiKey, isLoading: isBaasApiKeyLoading } = useApiKey({ type: 'meetingbaas' });
  const {
    calendars,
    isLoading: isCalendarsLoading,
    isError: isCalendarsError,
    mutate: mutateCalendars,
  } = useCalendars({
    apiKey: baasApiKey,
  });
  const {
    events,
    isLoading: isEventsLoading,
    mutate: mutateEvents,
  } = useCalendarEvents({
    calendars,
    apiKey: baasApiKey,
  });

  const [isPending, startTransition] = useTransition();

  const handleDeleteCalendar = useCallback(
    async (id: string) => {
      if (!baasApiKey) return;

      // Optimistic update
      const oldCalendars = calendars;
      const oldEvents = events;

      mutateCalendars(
        calendars?.filter((cal) => cal.uuid !== id),
        false,
      );
      mutateEvents(
        events?.filter((event) => event.calendarId !== id),
        false,
      );

      startTransition(async () => {
        try {
          const res = await deleteCalendarApi({ apiKey: baasApiKey, calendarId: id });
          if (res?.statusCode != 200) throw new Error('Failed to delete calendar.');
          await mutateCalendars();
          await mutateEvents();
          toast.success('Calendar deleted successfully');
        } catch (error) {
          console.error('Failed to delete calendar:', error);
          mutateCalendars(oldCalendars, false);
          mutateEvents(oldEvents, false);
          toast.error('Failed to delete calendar. Please try again.');
        }
      });
    },
    [baasApiKey, calendars, events, mutateCalendars, mutateEvents],
  );

  const isLoading = (!session && isSessionLoading) || (!baasApiKey && isBaasApiKeyLoading);

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

  if (isCalendarsError) {
    return <ErrorPage>Failed to fetch calendars. Please try again later.</ErrorPage>;
  }

  if (sessionError) {
    return <ErrorPage>Failed to fetch session data. Please try again later.</ErrorPage>;
  }

  return (
    <SidebarProvider>
      <AppSidebar
        calendars={calendars}
        isLoading={isCalendarsLoading}
        deleteCalendar={handleDeleteCalendar}
        mutateCalendars={async () => {
          await mutateCalendars();
          await mutateEvents();
        }}
      />
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
          <div className="flex h-full w-full flex-1 overflow-hidden">
            {isCalendarsLoading || isEventsLoading ? (
              <Skeleton className="flex-1" />
            ) : Array.isArray(calendars) && calendars.length > 0 && events ? (
              <Calendar calendarsData={calendars} eventsData={events} />
            ) : (
              <NoCalendars
                mutate={async () => {
                  await mutateCalendars();
                  await mutateEvents();
                }}
              />
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
