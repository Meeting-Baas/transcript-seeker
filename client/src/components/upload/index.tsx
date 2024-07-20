import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { gladiaApiKeyAtom, meetingsAtom } from '@/store/index';

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
import { startTranscription, uploadFile } from './gladia';

import { StorageBucketAPI } from '@/lib/bucketAPI';
import { Meeting, Transcript } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import convertToWav from './audioBufferToWav';
import { convertToBuffer, extractAudio } from './utils';

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

interface GladiaUtterance {
  speaker: number;
  words: {
    start: number;
    end: number;
    word: string;
  }[];
}

export function Upload({ children }: { children: React.ReactNode }) {
  const [gladiaApiKey] = useAtom(gladiaApiKeyAtom);
  const [, setMeetings] = useAtom(meetingsAtom);

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

    try {
      const buffer = await convertToBuffer(file);
      const audio = await extractAudio(buffer);
      const wav = convertToWav(audio);
      const blob = new Blob([wav], { type: 'audio/wav' });

      const uploadURL = await uploadFile(blob, gladiaApiKey);
      const transcript = await startTranscription(uploadURL.audio_url, gladiaApiKey);

      console.log('transcript', transcript);

      // Generate a unique bot_id
      const bot_id = `local_file_${Date.now()}`;

      const storageAPI = new StorageBucketAPI('local_files');
      await storageAPI.init();
      await storageAPI.set(`${bot_id}.mp4`, file);

      // Create a new MeetingInfo object
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
                transcripts: groupUtterancesBySpeaker(transcript.utterances),
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

      // Update the meetingData atom
      setMeetings((prevData: Meeting[]) => [...prevData, newMeeting]);

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
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload a file from your device</DialogTitle>
          <DialogDescription>
            {
              'Supported formats: .mp4, .avi, .mkv, .mov, .wmv, .webm, .mpeg, .mp3, .wav, .ogg, .aac, and .flac.'
            }
          </DialogDescription>
        </DialogHeader>
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

            <DialogFooter>
              <Button type="submit">
                <UploadCloudIcon className="mr-2 h-4 w-4" /> Upload
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function groupUtterancesBySpeaker(utterances: GladiaUtterance[]): Transcript[] {
  let groupedTranscripts: Transcript[] = [];
  let currentSpeaker: number | null = null;
  let currentWords: Transcript['words'] = [];
  let currentWordCount = 0;

  utterances.forEach((utterance) => {
    if (currentSpeaker === null || currentSpeaker !== utterance.speaker || currentWordCount >= 75) {
      if (currentWords.length > 0) {
        groupedTranscripts.push({
          speaker: `Speaker ${currentSpeaker! + 1}`,
          words: currentWords,
        });
      }
      currentSpeaker = utterance.speaker;
      currentWords = [];
      currentWordCount = 0;
    }

    utterance.words.forEach((word) => {
      currentWords.push({
        start_time: word.start,
        end_time: word.end,
        text: word.word.trim(),
      });
      currentWordCount++;

      if (currentWordCount >= 75) {
        groupedTranscripts.push({
          speaker: `Speaker ${currentSpeaker! + 1}`,
          words: currentWords,
        });
        currentWords = [];
        currentWordCount = 0;
      }
    });
  });

  // Add any remaining words
  if (currentWords.length > 0) {
    groupedTranscripts.push({
      speaker: `Speaker ${currentSpeaker! + 1}`,
      words: currentWords,
    });
  }

  return groupedTranscripts;
}
