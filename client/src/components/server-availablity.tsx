import axios from 'axios';
import { useEffect } from 'react';

import { cn } from '@/lib/utils';
import { baasApiKeyAtom, serverAvailabilityAtom } from '@/store';
import { useAtom } from 'jotai';

function ServerAvailablity() {
  const [serverAvailability, setServerAvailablity] = useAtom(serverAvailabilityAtom);
  const [baasApiKey] = useAtom(baasApiKeyAtom);

  const checkServerAvailability = async () => {
    try {
      const response = await axios.get('/api/health');
      if (response.status === 200) {
        setServerAvailablity('server');
      } else {
        setServerAvailablity('local');
      }
    } catch (error) {
      setServerAvailablity('local');
    }
  };

  useEffect(() => {
    if (!baasApiKey) {
      if (serverAvailability != 'error') setServerAvailablity('error');
      return;
    }
    checkServerAvailability();
  }, [baasApiKey]);

  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={cn('h-3.5 w-3.5 rounded-full border-2 border-white dark:border-gray-800', {
          'bg-green-500': serverAvailability === 'server',
          'bg-yellow-500': serverAvailability === 'local',
          'bg-red-500': serverAvailability === 'error',
        })}
      />
      {serverAvailability === 'server'
        ? 'Connected to API Backend'
        : serverAvailability === 'local'
          ? 'Running on IndexedDB'
          : 'Invalid or missing API Keys'}
    </div>
  );
}

export default ServerAvailablity;
