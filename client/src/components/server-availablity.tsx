import axios from 'axios';
import { useEffect } from 'react';

import { cn } from '@/lib/utils';
import { useApiKeysStore, useServerAvailabilityStore } from '@/store';

function ServerAvailablity() {
  const serverAvailability = useServerAvailabilityStore((state) => state.serverAvailability);
  const setServerAvailability = useServerAvailabilityStore((state) => state.setServerAvailability);
  
  const baasApiKey = useApiKeysStore((state) => state.baasApiKey);

  const checkServerAvailability = async () => {
    try {
      const response = await axios.get('/api/health');
      if (response.status === 200) {
        setServerAvailability('server');
      } else {
        setServerAvailability('local');
      }
    } catch (error) {
      setServerAvailability('local');
    }
  };

  useEffect(() => {
    if (!baasApiKey) {
      if (serverAvailability != 'error') setServerAvailability('error');
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
