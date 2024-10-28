
export interface CalendarEvent {
  anyoneCanAddSelf: boolean;
  attendees: Attendee[];
  attendeesOmitted: boolean;
  conferenceData: ConferenceData;
  created: string; // ISO date string
  creator: Creator;
  description: string;
  end: DateTime;
  endTimeUnspecified: boolean;
  etag: string;
  eventType: string;
  guestsCanInviteOthers: boolean;
  guestsCanModify: boolean;
  guestsCanSeeOtherGuests: boolean;
  hangoutLink: string;
  htmlLink: string;
  iCalUID: string;
  id: string;
  kind: string;
  location: string;
  locked: boolean;
  organizer: Organizer;
  originalStartTime: DateTime;
  privateCopy: boolean;
  recurringEventId: string;
  reminders: Reminders;
  start: DateTime;
  status: string;
  summary: string;
  updated: string; // ISO date string
}

export interface Attendee {
  email: string;
  optional: boolean;
  organizer: boolean;
  resource: boolean;
  responseStatus: string;
  self: boolean;
}

export interface ConferenceData {
  conferenceId: string;
  conferenceSolution: ConferenceSolution;
  entryPoints: EntryPoint[];
}

export interface ConferenceSolution {
  iconUri: string;
  key: Key;
  name: string;
}

export interface Key {
  type: string;
}

export interface EntryPoint {
  entryPointType: string;
  label: string;
  uri: string;
}

export interface Creator {
  email: string;
  self: boolean;
}

export interface DateTime {
  dateTime: string; // ISO date string
  timeZone: string;
}

export interface Organizer {
  email: string;
  self: boolean;
}

export interface Reminders {
  overrides: Reminder[];
  useDefault: boolean;
}

export interface Reminder {
  method: string;
  minutes: number;
}
