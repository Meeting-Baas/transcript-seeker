import type { createCalendarControlsPlugin } from '@schedule-x/calendar-controls';

export interface CalendarEvent {
  id: string | number;
  start: string;
  end: string;
  title?: string;
  people?: string[];
  location?: string;
  description?: string;
  calendarId?: string;
}

export interface ColorDefinition {
  main: string;
  container: string;
  onContainer: string;
}

export interface Calendar {
  colorName: string;
  label?: string;
  lightColors?: ColorDefinition;
  darkColors?: ColorDefinition;
}

export type Calendars = Record<string, Calendar>;

export type CalendarControlsPluginType = ReturnType<typeof createCalendarControlsPlugin>;
