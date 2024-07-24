'use client';

import { joinMeetingWrapper as joinMeeting } from '@/lib/axios';
import { baasApiKeyAtom, meetingsAtom, serverAvailabilityAtom } from '@/store';

import { zodResolver } from '@hookform/resolvers/zod';
import { DEFAULT_BOT_IMAGE, DEFAULT_BOT_NAME, DEFAULT_ENTRY_MESSAGE } from '@meeting-baas/shared';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Remove the axios import

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useAtom } from 'jotai';
import { Meeting } from '@/types';
import ServerAlert from '@/components/server-alert';

const formSchema = z.object({
  meetingURL: z.string().url().min(1, 'Meeting URL is required'),
  meetingBotName: z.string().optional(),
  meetingBotImage: z.string().url().optional(),
  meetingBotEntryMessage: z.string().optional(),
});

export function MeetingForm() {
  const [baasApiKey] = useAtom(baasApiKeyAtom);
  const [serverAvailability] = useAtom(serverAvailabilityAtom);
  const [meetings, setMeetings] = useAtom(meetingsAtom);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      meetingURL: '',
      meetingBotName: DEFAULT_BOT_NAME,
      meetingBotEntryMessage: DEFAULT_ENTRY_MESSAGE,
      meetingBotImage: DEFAULT_BOT_IMAGE,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { meetingURL, meetingBotName, meetingBotImage, meetingBotEntryMessage } = values;
      const result = await joinMeeting({
        baasApiKey,
        serverAvailability,
        params: {
          meetingURL,
          meetingBotName,
          meetingBotEntryMessage,
          meetingBotImage,
          apiKey: baasApiKey,
        },
      });

      if ('error' in result) {
        throw new Error(result.error);
      }

      const apiSource = serverAvailability === 'server' ? 'server API' : 'local implementation';

      const newMeeting: Meeting = {
        id: String(result.data.bot_id),
        bot_id: String(result.data.bot_id),
        name: 'Spoke Recorded Meeting',
        attendees: ['-'],
        createdAt: new Date(),
        status: 'loading',
      };
      setMeetings([...meetings, newMeeting]);
      // setMeetings((prevMeetings) => {
      //   const newMeetings = [...prevMeetings, { bot_id: result.data.bot_id, name: "New Meeting", attendees: ['-'], created_at: new Date() }];
      //   return newMeetings;
      // });
      console.log('form data', result.data);
      toast.success(`Meeting bot created successfully using ${apiSource}`);
    } catch (error) {
      console.error('Error adding meeting bot:', error);
      toast.error('Failed to create meeting bot');
    }
  }

  return (
    <>
      <div className="my-2 bg-white">
        <ServerAlert mode={serverAvailability} />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="meetingURL"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meeting URL *</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="Enter meeting URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="meetingBotName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meeting Bot Name (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={DEFAULT_BOT_NAME}
                    className={!field.value ? 'text-gray-400' : ''}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="meetingBotImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meeting Bot Image (optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder={DEFAULT_BOT_IMAGE}
                    className={!field.value ? 'text-gray-400' : ''}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="meetingBotEntryMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meeting Bot Entry Message (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={DEFAULT_ENTRY_MESSAGE}
                    className={!field.value ? 'text-gray-400' : ''}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* this doesn't really make sense if you think about it */}
          {/* <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Key (optional)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter API key" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}
