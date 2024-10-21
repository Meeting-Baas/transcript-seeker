import { useEffect } from 'react';
import { getAPIKey } from '@/queries';
import { useServerAvailabilityStore } from '@/store';
import useSWR from 'swr';

import { SelectAPIKey } from '@meeting-baas/db/schema';
import { cn } from '@meeting-baas/ui';

// Custom fetcher for SWR to use getAPIKey
const fetchAPIKey = async (type: SelectAPIKey['type']) => {
  const apiKey = await getAPIKey({ type });
  return apiKey?.content;
};

function ServerAvailablity() {
// todo: port this to
  const serverAvailability = useServerAvailabilityStore((state) => state.serverAvailability);
  const setServerAvailability = useServerAvailabilityStore((state) => state.setServerAvailability);

  const { data: baasApiKey } = useSWR('baasApiKey', () => fetchAPIKey('meetingbaas'));
  const { data: gladiaApiKey } = useSWR('gladiaApiKey', () => fetchAPIKey('gladia'));
  const { data: assemblyAIApiKey } = useSWR('assemblyAIApiKey', () => fetchAPIKey('assemblyai'));

  useEffect(() => {
    if (!baasApiKey && !gladiaApiKey && !assemblyAIApiKey) {
      if (serverAvailability != 'error') setServerAvailability('error');
      return;
    }
    setServerAvailability('local');
  }, [baasApiKey, gladiaApiKey, assemblyAIApiKey]);

  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={cn('h-3.5 w-3.5 rounded-full border-2 border-white dark:border-gray-800', {
          'bg-green-500': serverAvailability === 'local',
          'bg-red-500': serverAvailability === 'error',
        })}
      />
      {serverAvailability === 'local' ? 'Running on PGLite' : 'Invalid or missing API Keys'}
    </div>
  );
}

export default ServerAvailablity;
