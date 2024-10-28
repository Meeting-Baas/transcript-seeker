import { CalendarBaasEvent } from "@meeting-baas/shared";

export interface ExtendedCalendarBaasEvent extends CalendarBaasEvent {
    calendarId: string;
  }
  