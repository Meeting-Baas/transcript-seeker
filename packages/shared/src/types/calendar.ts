import type { CalendarEvent } from "./calendar-event";

export interface CalendarBaasEvent {
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
  raw: CalendarEvent;
  bot_param: any | null;
}

export interface CalendarBaasData {
  google_id: string;
  name: string;
  email: string;
  resource_id: string | null;
  uuid: string;
}
