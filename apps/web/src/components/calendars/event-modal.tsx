'use client';

import { ExtendedCalendarBaasEvent } from '@/types/calendar';
import { format } from 'date-fns';

import { Button } from '@meeting-baas/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@meeting-baas/ui/dialog';
import { Switch } from '@meeting-baas/ui/switch';

interface EventModalProps {
  event: ExtendedCalendarBaasEvent | null | undefined;
  isOpen: boolean;
  onClose: () => void;
  onRecordChange: (event: ExtendedCalendarBaasEvent, enabled: boolean) => void;
}

export function EventModal({ event, isOpen, onClose, onRecordChange }: EventModalProps) {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{event.name}</DialogTitle>
          <DialogDescription>
            {format(new Date(event.start_time), 'PPP p')} -{' '}
            {format(new Date(event.end_time), 'PPP p')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-medium">Record:</span>
            <div className="col-span-3">
              <Switch
                checked={!!event.bot_param}
                onCheckedChange={(checked: boolean) => onRecordChange(event, checked)}
              />
            </div>
          </div>
          {event.meeting_url && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-medium">Location:</span>
              <span className="col-span-3 max-h-24 overflow-y-auto break-words">
                <a
                  href={event.meeting_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {event.meeting_url}
                </a>
              </span>
            </div>
          )}
          {event.raw.description && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-medium">Description:</span>
              <span className="col-span-3 max-h-48 overflow-y-auto break-words">
                {event.raw.description}
              </span>
            </div>
          )}
          {event.raw.attendees && event.raw.attendees.length > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-medium">Attendees:</span>
              <span className="col-span-3 max-h-24 overflow-y-auto break-words">
                {event.raw.attendees.map((attendee) => attendee.email).join(', ')}
              </span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
