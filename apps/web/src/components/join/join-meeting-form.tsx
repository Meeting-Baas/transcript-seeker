'use client';

import { joinMeeting } from '@/lib/axios';
import { createMeeting, getAPIKey } from '@/queries';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import useSWR from 'swr';
import { z } from 'zod';

import type { SelectAPIKey } from '@meeting-baas/db/schema';
import {
  DEFAULT_BOT_IMAGE,
  DEFAULT_BOT_NAME,
  DEFAULT_ENTRY_MESSAGE
} from '@meeting-baas/shared';
// Remove the axios import

import { Button } from '@meeting-baas/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@meeting-baas/ui/form';
import { Input } from '@meeting-baas/ui/input';

// const fetchMeetings = async () => {
//   const meetings = await getMeetings();
//   if (!meetings) return [];
//   if (Array.isArray(meetings)) {
//     return meetings;
//   }
//   return [];
// };
const fetchAPIKey = async (type: SelectAPIKey['type']) => {
  const apiKey = await getAPIKey({ type });
  if (apiKey) return apiKey.content;
  return null;
};

const formSchema = z.object({
  meetingURL: z.string().url().min(1, 'Meeting URL is required'),
  meetingBotName: z.string().optional(),
  meetingBotImage: z.string().url().optional(),
  meetingBotEntryMessage: z.string().optional(),
});

export function MeetingForm() {
  const { data: baasApiKey } = useSWR('baasApiKey', () => fetchAPIKey('meetingbaas'));
  // const { data: meetings } = useSWR('meetings', () => fetchMeetings());

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
        meetingURL,
        meetingBotName,
        meetingBotEntryMessage,
        meetingBotImage,
        apiKey: baasApiKey ?? '',
      });

      if ('error' in result) {
        throw new Error(result.error);
      }

      createMeeting({
        botId: result.data?.bot_id ?? '',
        type: 'meetingbaas',
        name: 'MeetingBaas Recorded Meeting',
        attendees: ['-'],
        transcripts: [],
        assets: {
          video_url: null,
          video_blob: null,
        },
        createdAt: new Date(),
        status: 'loading',
      });
      toast.success(`Meeting bot created successfully!`);
    } catch (error) {
      console.error('Error adding meeting bot:', error);
      toast.error('Failed to create meeting bot');
    }
  }

  return (
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
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}
