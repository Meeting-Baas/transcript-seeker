import ServerAlert from '@/components/server-alert';
import { getAPIKey } from '@/queries'; // Assuming you already have this

import { useServerAvailabilityStore } from '@/store';
import { SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';

import { SelectAPIKey } from '@meeting-baas/db/schema';
import { cn } from '@meeting-baas/ui';
import { buttonVariants } from '@meeting-baas/ui/button';

// Custom fetcher for SWR to use getAPIKey
const fetchAPIKey = (type: SelectAPIKey['type']) => getAPIKey({ type });

function RootPage() {
  const serverAvailability = useServerAvailabilityStore((state) => state.serverAvailability);
  const { data: baasApiKey } = useSWR('meetingbaas', () => fetchAPIKey('meetingbaas'));
  const { data: gladiaApiKey } = useSWR('gladia', () => fetchAPIKey('gladia'));
  const { data: assemblyAIApiKey } = useSWR('assemblyai', () => fetchAPIKey('assemblyai'));
  const apiKeysExist = baasApiKey?.content || gladiaApiKey?.content || assemblyAIApiKey?.content;

  return (
    <div className="relative flex h-full min-h-[calc(100dvh-94px)] flex-col items-center justify-center space-y-2 px-4">
      <div className="fixed left-0 right-0 top-4 z-50 mx-4 flex justify-center">
        <div className="max-w-md">
          <ServerAlert mode={serverAvailability} />
        </div>
      </div>

      <div className="flex w-full max-w-md flex-col items-center justify-center">
        <h1 className="mb-2 text-center text-4xl font-bold">Transcript Seeker</h1>
        <p className="mb-6 text-center text-lg">
          <a
            href="https://github.com/meeting-baas/transcript-seeker"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Open-source
          </a>{' '}
          interface by{' '}
          <a
            href="https://meetingbaas.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Meeting Baas
          </a>{' '}
          🐟
        </p>
        <div className="flex w-full items-center gap-4 pb-2">
          <Link to="/recordings" className={cn(buttonVariants({ variant: 'outline' }), 'flex-1')}>
            Recordings
          </Link>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-4">
          <Link
            to="/settings"
            className={cn(
              buttonVariants({ variant: apiKeysExist ? 'secondary' : 'default' }),
              'h-16 flex-1 text-lg',
            )}
          >
            <SettingsIcon className="mr-2 h-4 w-4" /> API Keys
          </Link>
          <Link
            to="/upload"
            className={cn(buttonVariants({ variant: 'default' }), 'h-16 flex-1 text-lg', {
              'pointer-events-none opacity-50':
                !gladiaApiKey?.content && !assemblyAIApiKey?.content,
            })}
          >
            Upload File
          </Link>
          <Link
            to="/join"
            className={cn(buttonVariants({ variant: 'default' }), 'h-16 flex-1 text-lg', {
              'pointer-events-none opacity-50': !baasApiKey?.content,
            })}
          >
            Record Meeting
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RootPage;
