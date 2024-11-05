import type { CalendarControlsPluginType } from '@/types/schedulex';
import type { CalendarApp } from '@schedule-x/calendar';
import { useCallback, useMemo } from 'react';
import { endOfWeek, format, isSameMonth, isSameYear, startOfWeek } from 'date-fns';

interface RangeHeadingProps {
  calendar: CalendarApp & {
    calendarControls: CalendarControlsPluginType;
  };
  date: Date;
  view: string;
}

function RangeHeading({ date, view }: RangeHeadingProps) {
  const getMonthAndYearForSelectedDate = useCallback((selectedDate: Date) => {
    return format(selectedDate, 'MMMM yyyy');
  }, []);

  const getMonthAndYearForDateRange = useCallback(
    (selectedDate: Date, startDate: Date, endDate: Date) => {
      if (isSameMonth(startDate, endDate) && isSameYear(startDate, endDate)) {
        return format(startDate, 'MMMM yyyy');
      } else if (isSameYear(startDate, endDate)) {
        return `${format(startDate, 'MMMM')} - ${format(endDate, 'MMMM yyyy')}`;
      } else {
        return `${format(startDate, 'MMMM yyyy')} - ${format(endDate, 'MMMM yyyy')}`;
      }
    },
    [],
  );

  const currentHeading = useMemo(() => {
    if (view === 'week') {
      const weekStart = startOfWeek(date);
      const weekEnd = endOfWeek(date);
      return getMonthAndYearForDateRange(date, weekStart, weekEnd);
    } else {
      return getMonthAndYearForSelectedDate(date);
    }
  }, [view, date, getMonthAndYearForDateRange, getMonthAndYearForSelectedDate]);

  return <h3 className="text-xl">{currentHeading}</h3>;
}

export default RangeHeading;
