export interface CalendarEvent {
  id: number;
  start: string;
  end: string;
  title?: string;
  people?: string[];
  location?: string;
  description?: string;
  calendarId?: string;
}

export type ColorDefinition = {
  main: string;
  container: string;
  onContainer: string;
};

export type Calendar = {
  colorName: string;
  label?: string;
  lightColors?: ColorDefinition;
  darkColors?: ColorDefinition;
};

export type Calendars = {
  [key: string]: Calendar
};
