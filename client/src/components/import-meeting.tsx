import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { toast } from 'sonner';
import { getMeetings, createMeeting } from '@/queries';
import useSWR from 'swr';
// import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  botId: z.string().min(2, {
    message: 'Bot ID must be at least 2 characters.',
  }),
});

const fetchMeetings = async () => await getMeetings();

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
    let { botId: botId } = values;
    if (meetings?.some((meeting) => meeting.bot_id === botId)) {
      toast.error('This meeting has already been imported');
      return;
    }

    await createMeeting(
      {
        bot_id: botId,
        type: 'meetingbaas',
        name: 'Imported Meeting',
        attendees: ['-'],
        status: 'loading',
      },
    );
    mutate();

    toast.success('Meeting imported successfully');
    // navigate(`/meeting/${botId}`)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full items-start justify-between gap-2"
      >
        <FormField
          control={form.control}
          name="botId"
          render={({ field }) => (
            <FormItem className="w-full">
              {/* <FormLabel>Username</FormLabel> */}
              <FormControl>
                <Input placeholder="Bot Id" {...field} />
              </FormControl>
              {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="text-md">
          Import Meeting
        </Button>
      </form>
    </Form>
  );
}
