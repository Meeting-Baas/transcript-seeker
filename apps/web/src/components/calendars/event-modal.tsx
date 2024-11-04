'use client';

import type { CalendarEvent } from '@/types/schedulex';
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

interface EventModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventModal({ event, isOpen, onClose }: EventModalProps) {
  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
          <DialogDescription>
            {format(new Date(event.start), 'PPP p')} - {format(new Date(event.end), 'PPP p')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {event.location && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-medium">Location:</span>
              <span className="col-span-3">{event.location}</span>
            </div>
          )}
          {event.description && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-medium">Description:</span>
              <span className="col-span-3">{event.description}</span>
            </div>
          )}
          {event.people && event.people.length > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-medium">Attendees:</span>
              <span className="col-span-3">{event.people.join(', ')}</span>
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
