import { fetchMeetings } from '@/lib/swr';
import { createMeeting } from '@/queries';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import useSWR from 'swr';
import { z } from 'zod';

import { Button } from '@meeting-baas/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@meeting-baas/ui/form';
import { Input } from '@meeting-baas/ui/input';

// import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  botId: z.string().min(2, {
    message: 'Bot ID must be at least 2 characters.',
  }),
});

export function ImportMeeting() {
  // const navigate = useNavigate();
  const { data: meetings, mutate } = useSWR('meetings', () => fetchMeetings());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      botId: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { botId: botId } = values;
    if (meetings?.some((meeting) => meeting.botId === botId)) {
      toast.error('This meeting has already been imported');
      return;
    }

    await createMeeting({
      botId: botId,
      type: 'meetingbaas',
      name: 'Imported Meeting',
      attendees: ['-'],
      transcripts: [],
      assets: {
        video_url: null,
        video_blob: null,
      },
      status: 'loading',
    });
    mutate();

    toast.success('Meeting imported successfully');
    // navigate(`/meeting/${botId}`)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full items-start justify-between gap-2 rounded-t-md border-x border-t border-border px-2 pb-1 pt-2"
      >
        <FormField
          control={form.control}
          name="botId"
          render={({ field }) => (
            <FormItem className="w-full">
              {/* <FormLabel>Username</FormLabel> */}
              <FormControl>
                <Input placeholder="Import meeting with Bot ID..." {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="min-w-32">
          Import
        </Button>
      </form>
    </Form>
  );
}
