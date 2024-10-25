import { useTransition } from 'react';
import { useApiKey } from '@/hooks/use-api-key';
import { createCalendar } from '@/lib/meetingbaas';
import { toast } from 'sonner';

import { Button } from '@meeting-baas/ui/button';
import { CreateCalendarParams } from '@meeting-baas/shared';

export function NoCalendars() {
  const [isPending, startTransition] = useTransition();
  const { apiKey } = useApiKey({ type: 'meetingbaas' });

  const handleCreateCalendar = () => {
    if (!apiKey) {
      toast.error('Error', {
        description: 'API key is not available. Please check your configuration.',
      });
      return;
    }

    startTransition(async () => {
      try {
        const params: CreateCalendarParams = {
          platform: 'Google',
          apiKey,
        };
        await createCalendar(params);
        toast.success('Success', {
          description: 'Calendar created successfully. Please refresh the page.',
        });
      } catch (error) {
        console.error('Failed to create calendar:', error);
        toast.error('Error', {
          description: 'Failed to create calendar. Please try again.',
        });
      }
    });
  };

  return (
    <div className="flex flex-1 h-full flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold">You don't have any calendars yet</h2>
      <p className="mb-6 text-muted-foreground">Create a calendar to get started</p>
      <Button onClick={handleCreateCalendar} disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Calendar'}
      </Button>
    </div>
  );
}