import { getEditorByMeetingId } from "@/queries";
import { SelectEditor } from "@meeting-baas/db/schema";
import useSWR from "swr";

const fetcher =  async (meetingId: SelectEditor['meetingId']) => {
  const editor = await getEditorByMeetingId({ meetingId });
  if (!editor) return null;
  return editor;
};

function useEditor({ meetingId }: { meetingId: SelectEditor['meetingId'] }) {
  const { data, error, isLoading } = useSWR(['editor', meetingId], ([key, meetingId]) => fetcher(meetingId));

  return {
    editor: data,
    isLoading,
    isError: error,
  };
}

export { useEditor };