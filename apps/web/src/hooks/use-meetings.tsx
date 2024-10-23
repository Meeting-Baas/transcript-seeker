import { getMeetings } from '@/queries';
import useSWR from 'swr';

const fetcher = async () => {
  const meetings = await getMeetings();
  if (!meetings) return [];
  return meetings;
};

function useMeetings() {
  const { data, error, isLoading } = useSWR('meetings', fetcher);

  return {
    meetings: data,
    isLoading,
    isError: error,
  };
}

export { useMeetings };
