import { StorageBucketAPI } from '@/lib/storage-bucket-api';
import * as assemblyai from '@/lib/transcription/assemblyai';
import * as gladia from '@/lib/transcription/gladia';
import { createMeeting, getAPIKey, setEditor } from '@/queries';
import type { Meeting, Transcript as TranscriptT } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadCloudIcon } from 'lucide-react';
import type { JSONContent } from 'novel';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import useSWR from 'swr';
import { v4 as uuidv4 } from 'uuid';
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

import type { Provider } from './types';

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
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      'Only .mp4, .avi, .mkv, .mov, .wmv, .webm, .mpeg, .mp3, .wav, .ogg, .aac, and .flac formats are supported.',
    ),
});

interface UploadProps {
  provider: Provider;
  language: string;
  options: Record<string, any>;
}

const fetchAPIKey = async (type: SelectAPIKey['type']) => {
  const apiKey = await getAPIKey({ type });
  if (apiKey) return apiKey.content;
  return null;
};

interface TranscriptionFunctionResponse {
  summarization?: {
    results: string,
  }
}

export function UploadForm({ provider, options }: UploadProps) {
  const { data: gladiaApiKey } = useSWR('gladiaApiKey', () => fetchAPIKey('gladia'));
  const { data: assemblyAIApiKey } = useSWR('assemblyAIApiKey', () => fetchAPIKey('assemblyai'));
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { file } = values;
    const loading = toast.loading('Processing file...');

    console.log('options', options);
    try {
      let transcripts: TranscriptT[] = [];
      let data: TranscriptionFunctionResponse = {};

      const transcriptionFunctions = {
        gladia: gladia.transcribe,
        assemblyai: assemblyai.transcribe,
      };

      const apiKeys = {
        gladia: gladiaApiKey ?? '',
        assemblyai: assemblyAIApiKey ?? '',
      };

      if (provider in transcriptionFunctions) {
        ({ transcripts, data } = await transcriptionFunctions[provider](
          file,
          apiKeys[provider],
          options,
        ));
      } else {
        throw new Error(`Unsupported provider: ${provider}`);
      }

      console.log('transcripts', transcripts);

      const botId = uuidv4();
  
      const storageAPI = new StorageBucketAPI('local_files');
      await storageAPI.init();
      await storageAPI.set(`${botId}.mp4`, file);

      const newMeeting: Omit<Meeting, 'id'> = {
        botId: botId,
        name: file.name,
        attendees: ['-'],
        createdAt: new Date(),
        status: 'loaded',
        type: 'local',
        transcripts: transcripts,
        assets: {
          video_url: null,
          video_blob: null,
        },
      };

      const { id } = await createMeeting(newMeeting);
      // todo: check if this wokrs
      if (data.summarization) {
        const content: JSONContent = {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text:
                    data.summarization.results ||
                    'Oops! Something went wrong while trying to load summarization data!',
                },
              ],
            },
          ],
        };

        await setEditor({ meetingId: id, content: content });
      }

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
                  onChange={(event) => onChange(event.target.files?.[0])}
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
