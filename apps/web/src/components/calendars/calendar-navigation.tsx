import type { CalendarApp } from '@schedule-x/calendar';
import React, { useCallback, useMemo } from 'react';
import { CalendarControlsPluginType } from '@/types/schedulex';
import { format, isAfter, isBefore, isSameDay, isValid, parseISO, startOfDay } from 'date-fns';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';

import { Button } from '@meeting-baas/ui/button';

import RangeHeading from './range-heading';

interface CalendarNavigationProps {
  calendar: CalendarApp & {
    calendarControls: CalendarControlsPluginType;
  };
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

export default function CalendarNavigation({ calendar, date, setDate }: CalendarNavigationProps) {
  const minDate = calendar.calendarControls.getMinDate();
  const maxDate = calendar.calendarControls.getMaxDate();

  const { isBackwardsDisabled, isForwardsDisabled, isTodayDisabled } = useMemo(() => {
    const today = startOfDay(new Date());

    if (!isValid(date)) {
      console.error('Invalid current date');
      return { isBackwardsDisabled: false, isForwardsDisabled: false, isTodayDisabled: false };
    }

    const parsedMinDate = minDate ? parseISO(minDate) : null;
    const parsedMaxDate = maxDate ? parseISO(maxDate) : null;

    return {
      isBackwardsDisabled: parsedMinDate ? isBefore(date, parsedMinDate) : false,
      isForwardsDisabled: parsedMaxDate ? isAfter(date, parsedMaxDate) : false,
      isTodayDisabled: isSameDay(date, today),
    };
  }, [calendar.calendarControls, date, minDate, maxDate]);

  const navigate = useCallback(
    (direction: 'forwards' | 'backwards') => {
      const views = calendar.calendarControls.getViews();
      const currentView = views.find((view) => view.name === calendar.calendarControls.getView());

      if (!currentView) return;

      const stringDate = format(date, 'yyyy-MM-dd');
      const res = currentView.backwardForwardFn(
        stringDate,
        direction === 'forwards'
          ? currentView.backwardForwardUnits
          : -currentView.backwardForwardUnits,
      );
      setDate(new Date(res));
    },
    [calendar.calendarControls, date, setDate],
  );

  const goToToday = useCallback(() => {
    const today = startOfDay(new Date());
    setDate(today);
    calendar.calendarControls.setDate(format(today, 'yyyy-MM-dd'));
  }, [calendar.calendarControls, setDate]);

  return (
    <div className="flex gap-2 items-center">
      <Button variant="outline" onClick={goToToday} disabled={isTodayDisabled}>
        Today
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate('backwards')}
        disabled={isBackwardsDisabled}
      >
        <ArrowLeftIcon className="size-6" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate('forwards')}
        disabled={isForwardsDisabled}
      >
        <ArrowRightIcon className="size-6" />
      </Button>
      <RangeHeading calendar={calendar} date={date} setDate={setDate} />
    </div>
  );
}
