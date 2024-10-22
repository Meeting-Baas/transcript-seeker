import { getAPIKey } from '@/queries';
import useSWR from 'swr';

import { SelectAPIKey } from '@meeting-baas/db/schema';

const fetcher = async (type: SelectAPIKey['type']) => {
  const apiKey = await getAPIKey({ type });
  if (apiKey) return apiKey.content;
  return null;
};

function useApiKey({ type }: { type: SelectAPIKey['type'] }) {
  const { data, error, isLoading } = useSWR(['apiKey', type], ([key, type]) => fetcher(type));

  return {
    apiKey: data,
    isLoading,
    isError: error,
  };
}

export { useApiKey };
