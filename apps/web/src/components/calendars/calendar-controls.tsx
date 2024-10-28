import type { CalendarApp } from '@schedule-x/calendar';
import { useCallback } from 'react';
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
  view: string;
  setView: React.Dispatch<React.SetStateAction<string>>;
}

export default function CalendarControls({
  date,
  setDate,
  view,
  setView,
}: CalendarControlsProps) {
  return (
    <div className="flex gap-2">
      <CalendarSelect view={view} setView={setView} />
      <CalendarDatePicker className="w-[200px]" date={date} setDate={setDate} />
    </div>
  );
}

interface CalendarSelectProps {
  view: string;
  setView: React.Dispatch<React.SetStateAction<string>>;
}

function CalendarSelect({ view, setView }: CalendarSelectProps) {
  const handleViewChange = useCallback(
    (newView: string) => {
      setView(newView);
    },
    [setView],
  );

  return (
    <Select value={view} onValueChange={handleViewChange}>
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
