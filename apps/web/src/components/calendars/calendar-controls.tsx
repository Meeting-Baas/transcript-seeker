import type { CalendarApp } from '@schedule-x/calendar';
import { useEffect } from 'react';
import { CalendarControlsPluginType } from '@/types/schedulex';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@meeting-baas/ui/select';

import CalendarDatePicker from './calendar-date-picker';

interface CalendarControlsProps {
  calendar: CalendarApp & {
    calendarControls: CalendarControlsPluginType;
  };
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

export default function CalendarControls({ calendar, date, setDate }: CalendarControlsProps) {
  return (
    <div className="flex gap-2">
      <CalendarSelect calendar={calendar} />
      <CalendarDatePicker className="w-[200px]" date={date} setDate={setDate} />
    </div>
  );
}

interface CalendarSelectProps {
  calendar: CalendarApp & {
    calendarControls: CalendarControlsPluginType;
  };
}

function CalendarSelect({ calendar }: CalendarSelectProps) {
  return (
    <Select
      defaultValue={calendar.calendarControls.getView()}
      onValueChange={(v) => calendar.calendarControls.setView(v)}
    >
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="View" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="day">Day</SelectItem>
        <SelectItem value="week">Week</SelectItem>
        <SelectItem value="month-grid">Month</SelectItem>
      </SelectContent>
    </Select>
  );
}
