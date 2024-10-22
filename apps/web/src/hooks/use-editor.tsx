import { getEditorByMeetingId } from '@/queries';
import useSWR from 'swr';

import type { SelectEditor } from '@meeting-baas/db/schema';

const fetcher = async (meetingId: SelectEditor['meetingId']) => {
  const editor = await getEditorByMeetingId({ meetingId });
  if (!editor) return null;
  return editor;
};

function useEditor({ meetingId }: { meetingId: SelectEditor['meetingId'] }) {
  const { data, error, isLoading } = useSWR(['editor', meetingId], ([key, meetingId]) =>
    fetcher(meetingId),
  );

  return {
    editor: data,
    isLoading,
    isError: error,
  };
}

export { useEditor };
