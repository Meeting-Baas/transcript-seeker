import { getChatByMeetingId } from '@/queries';
import useSWR from 'swr';

import type { SelectChat } from '@meeting-baas/db/schema';

const fetcher = async (meetingId: SelectChat['meetingId']) => {
  const chat = await getChatByMeetingId({ meetingId });
  return chat ?? null;
};

function useChat({ meetingId }: { meetingId: SelectChat['meetingId'] }) {
  const { data, error, isLoading } = useSWR(['chat', meetingId], ([key, meetingId]) =>
    fetcher(meetingId),
  );

  return {
    chat: data,
    messages: data?.messages ?? [],
    isLoading,
    isError: error,
  };
}

export { useChat };
