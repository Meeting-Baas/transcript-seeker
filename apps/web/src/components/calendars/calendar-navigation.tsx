import type { CalendarApp } from '@schedule-x/calendar';
import React, { useMemo } from 'react';
import { CalendarControlsPluginType } from '@/types/schedulex';
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';

import { Button } from '@meeting-baas/ui/button';

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

//   const { isBackwardsDisabled, isForwardsDisabled } = useMemo(() => {
//     const currentDate = parseISO(calendar.calendarControls.getDate());
//     const parsedMinDate = parseISO(minDate);
//     const parsedMaxDate = parseISO(maxDate);

//     return {
//       isBackwardsDisabled: isBefore(currentDate, parsedMinDate),
//       isForwardsDisabled: isAfter(currentDate, parsedMaxDate),
//     };
//   }, [calendar.calendarControls, minDate, maxDate]);

  const navigate = (direction: 'forwards' | 'backwards') => {
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
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate('backwards')}
        // disabled={isBackwardsDisabled}
      >
        <ArrowLeftIcon className="size-6" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate('forwards')}
        // disabled={isForwardsDisabled}
      >
        <ArrowRightIcon className="size-6" />
      </Button>
    </div>
  );
}
