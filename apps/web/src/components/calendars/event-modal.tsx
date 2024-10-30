'use client';

import { CalendarEvent } from '@/types/schedulex';
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
import { format } from 'date-fns';

interface EventModalProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleRecord: (event: CalendarEvent, enabled: boolean) => void;
  isRecording?: boolean;
}

export function EventModal({ event, isOpen, onClose, onToggleRecord, isRecording = false }: EventModalProps) {
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
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-medium">Record:</span>
            <div className="col-span-3">
              <Switch
                checked={isRecording}
                onCheckedChange={(checked: boolean) => onToggleRecord(event, checked)}
              />
            </div>
          </div>
          {event.location && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-medium">Location:</span>
              <span className="col-span-3 break-words overflow-y-auto max-h-24">
                {event.location.match(/^https?:\/\//) ? (
                  <a
                    href={event.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {event.location}
                  </a>
                ) : (
                  event.location
                )}
              </span>
            </div>
          )}
          {event.description && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-medium">Description:</span>
              <span className="col-span-3 break-words overflow-y-auto max-h-48">{event.description}</span>
            </div>
          )}
          {event.people && event.people.length > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-medium">Attendees:</span>
              <span className="col-span-3 break-words overflow-y-auto max-h-24">
                {event.people.join(', ')}
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
