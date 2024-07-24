import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { editorsAtom, gladiaApiKeyAtom, meetingsAtom } from '@/store/index';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { UploadCloudIcon } from 'lucide-react';
import { toast } from 'sonner';

import * as gladia from '../../lib/transcription/gladia';

import { Button } from '@/components/ui/button';
import { StorageBucketAPI } from '@/lib/bucketAPI';
import { Meeting } from '@/types';
import { useNavigate } from 'react-router-dom';
import { updateById } from '@/lib/db';

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
  provider: string;
  language: string;
  options: {
    [key: string]: any;
  };
}

export function Upload({ options }: UploadProps) {
  const [gladiaApiKey] = useAtom(gladiaApiKeyAtom);

  const [editors, setEditors] = useAtom(editorsAtom);
  const [meetings, setMeetings] = useAtom(meetingsAtom);

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
      const { transcript, data } = await gladia.transcribe(file, gladiaApiKey, options);
      console.log('transcript', transcript);

      // Generate a unique bot_id
      const date = Date.now();
      const bot_id = `local_file_${date}`;

      const storageAPI = new StorageBucketAPI('local_files');
      await storageAPI.init();
      await storageAPI.set(`${bot_id}.mp4`, file);

      const newMeeting: Meeting = {
        id: bot_id,
        bot_id: bot_id,
        name: file.name, // Use the file name as the meeting name
        attendees: ['-'], // You might want to extract attendees from the transcript
        createdAt: new Date(),
        status: 'loaded',
        data: {
          id: bot_id,
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
              mp4_s3_path: '', // We don't have this information from the transcript
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
          id: bot_id,
          originalData: editors,
          updateData: { content }, // Assuming `content` should be part of the updated data
        });
        setEditors(newEditors);
      }

      setMeetings([...meetings, newMeeting]);
      console.log([...meetings, newMeeting], meetings);
      toast.success('File processed and meeting stored successfully!', {
        id: loading,
      });
      
      navigate(`/meeting/${bot_id}`);
    } catch (error) {
      console.error('Error generating transcript:', error);
      toast.error('Oops! Something went wrong, please try again later', {
        id: loading,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
