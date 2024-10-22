import { useEffect } from 'react';
import { useServerAvailabilityStore } from '@/store';

import { cn } from '@meeting-baas/ui';
import { useApiKey } from '@/hooks/use-api-key';

function ServerAvailablity() {
  const serverAvailability = useServerAvailabilityStore((state) => state.serverAvailability);
  const setServerAvailability = useServerAvailabilityStore((state) => state.setServerAvailability);

  const { apiKey: baasApiKey, isLoading: isBaasApiKeyLoading } = useApiKey({ type: 'meetingbaas' });
  const { apiKey: gladiaApiKey, isLoading: isGladiaApiKeyLoading } = useApiKey({ type: 'gladia' });
  const { apiKey: assemblyAIApiKey, isLoading: isAssemblyAIApiKeyLoading } = useApiKey({ type: 'assemblyai' });

  useEffect(() => {
    if (isBaasApiKeyLoading || isGladiaApiKeyLoading || isAssemblyAIApiKeyLoading) {
      setServerAvailability('loading');
      return;
    }
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
          'bg-gray-500': serverAvailability === 'loading',
          'bg-green-500': serverAvailability === 'local',
          'bg-red-500': serverAvailability === 'error',
        })}
      />
      {serverAvailability === 'loading' && 'Loading...'}
      {serverAvailability === 'local' && 'Running on PGLite'}
      {serverAvailability === 'error' && 'Invalid or missing API Keys'}
    </div>
  );
}

export default ServerAvailablity;
