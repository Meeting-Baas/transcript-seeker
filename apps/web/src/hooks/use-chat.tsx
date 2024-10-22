import { getChatByMeetingId } from "@/queries";
import { SelectChat } from "@meeting-baas/db/schema";
import useSWR from "swr";

const fetcher = async (meetingId: SelectChat['meetingId']) => {
  const chat = await getChatByMeetingId({ meetingId });
  if (chat) return chat;
  return null;
};

function useChat({ meetingId }: { meetingId: SelectChat['meetingId'] }) {
  const { data, error, isLoading } = useSWR(['chat', meetingId], ([key, meetingId]) => fetcher(meetingId));

  return {
    chat: data,
    isLoading,
    isError: error,
  };
}

export { useChat };