import { StorageBucketAPI } from '@/lib/bucketAPI';
import * as assemblyai from '@/lib/transcription/assemblyai';
import * as gladia from '@/lib/transcription/gladia';
import { createMeeting, getAPIKey, getEditors, getMeetings } from '@/queries';
import { useApiKeysStore, useEditorsStore, useMeetingsStore } from '@/store/index';
import { Meeting } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadCloudIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import useSWR from 'swr';
import { z } from 'zod';

import type { SelectAPIKey } from '@meeting-baas/db/schema';
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

import { Provider } from './types';

const MAX_FILE_SIZE = 3000 * 1024 * 1024; // 1000 MB (100 * 1024 KB * 1024 bytes)
const ACCEPTED_FILE_TYPES = [
  'video/mp4',
  'video/avi',
  'video/mkv',
  'video/mov',
  'video/wmv',
  'video/webm',
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/aac',
  'audio/flac',
];

const formSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size < MAX_FILE_SIZE, {
      message: `Sorry, max file is set to ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
    })
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file?.type),
      'Only .mp4, .avi, .mkv, .mov, .wmv, .webm, .mpeg, .mp3, .wav, .ogg, .aac, and .flac formats are supported.',
    ),
});

interface UploadProps {
  provider: Provider;
  language: string;
  options: {
    [key: string]: any;
  };
}

const fetchAPIKey = async (type: SelectAPIKey['type']) => await getAPIKey({ type });
const fetchMeetings = async () => {
  const meetings = await getMeetings();
  if (!meetings) return [];
  if (Array.isArray(meetings)) {
    return meetings;
  }
  return [];
};
const fetchEditors = async () => {
  const editors = await fetchEditors();
  if (!editors) return [];
  if (Array.isArray(editors)) {
    return editors;
  }
  return [];
};

export function Upload({ provider, options }: UploadProps) {
  const { data: gladiaApiKey } = useSWR('gladia', () => fetchAPIKey('gladia'));
  const { data: assemblyAIApiKey } = useSWR('assemblyai', () => fetchAPIKey('assemblyai'));

  const { data: editors, mutate: mutateEditors } = useSWR('editors', () => fetchEditors());
  const { data: meetings, mutate: mutateMeetings } = useSWR('meetings', () => fetchMeetings());

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { file } = values;
    const loading = toast.loading('Processing file...');

    console.log('options', options);

    try {
      // const blob = new Blob([file], { type: 'video/mp4' });
      let transcript;
      let data;

      const transcriptionFunctions = {
        gladia: gladia.transcribe,
        assemblyai: assemblyai.transcribe,
      };

      const apiKeys = {
        gladia: gladiaApiKey?.content ?? '',
        assemblyai: assemblyAIApiKey?.content ?? '',
      };

      // assemblyAIApiKey do the same logic but have api key select
      if (provider in transcriptionFunctions) {
        ({ transcript, data } = await transcriptionFunctions[provider](
          file,
          apiKeys[provider],
          options,
        ));
      } else {
        throw new Error(`Unsupported provider: ${provider}`);
      }

      console.log('transcript', transcript);

      // Generate a unique bot_id
      const date = Date.now();
      const botId = `local_file_${date}`;

      const storageAPI = new StorageBucketAPI('local_files');
      await storageAPI.init();
      await storageAPI.set(`${botId}.mp4`, file);

      const newMeeting: Omit<Meeting, 'id'> = {
        botId: botId,
        name: file.name, // Use the file name as the meeting name
        attendees: ['-'], // You might want to extract attendees from the transcript
        createdAt: new Date(),
        status: 'loaded',
        data: {
          id: botId,
          name: file.name, // Use the file name as the meeting name
          editors: [
            {
              video: {
                transcripts: transcript,
              },
            },
          ],
          attendees: [{ name: '-' }], // The transcript doesn't provide attendee information
          assets: [
            {
              s3_path: '', // We don't have this information from the transcript
            },
          ],
          created_at: {
            secs_since_epoch: Math.floor(Date.now() / 1000),
            nanos_since_epoch: (Date.now() % 1000) * 1000000,
          },
        },
      };

      if (data.summarization) {
        const content = {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text:
                    data.summarization?.results ||
                    'Oops! Something went wrong while trying to load summarization data!',
                },
              ],
            },
          ],
        };

        const newEditors = updateById({
          id: botId,
          originalData: editors,
          updateData: { content }, // Assuming `content` should be part of the updated data
        });
        setEditors(newEditors);
      }

      createMeeting([...meetings, newMeeting]);
      toast.success('File processed and meeting stored successfully!', {
        id: loading,
      });

      navigate(`/meeting/${botId}`);
    } catch (error) {
      console.error('Error generating transcript:', error);
      toast.error('Oops! Something went wrong, please try again later', {
        id: loading,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  type="file"
                  accept="audio/*,video/*"
                  onChange={(event) => onChange(event.target.files && event.target.files[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button type="submit">
            <UploadCloudIcon className="mr-2 h-4 w-4" /> Upload
          </Button>
        </div>
      </form>
    </Form>
  );
}
