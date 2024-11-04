import { useTransition } from 'react';
import { useApiKey } from '@/hooks/use-api-key';
import { createCalendar } from '@/lib/meetingbaas';
import { toast } from 'sonner';

import type { CreateCalendarParams } from '@meeting-baas/shared';
import { Button } from '@meeting-baas/ui/button';

interface CreateCalendarProps {
  mutate: () => Promise<void>;
}

export function CreateCalendar({ mutate }: CreateCalendarProps) {
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
        const res = await createCalendar(params);
        if (!res) throw new Error('Failed to create calendar.');
        toast.success('Success', {
          description: 'Calendar created successfully. Please refresh the page.',
        });
        await mutate();
      } catch (error) {
        console.error('Failed to create calendar:', error);
        toast.error('Error', {
          description: 'Failed to create calendar. Please try again.',
        });
      }
    });
  };

  return (
    <Button onClick={handleCreateCalendar} disabled={isPending}>
      {isPending ? 'Creating...' : 'Create Calendar'}
    </Button>
  );
}
