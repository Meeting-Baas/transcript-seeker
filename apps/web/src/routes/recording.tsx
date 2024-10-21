import type { Meeting as MeetingT } from '@/types';
import { Viewer } from '@/components/viewer';
import { StorageBucketAPI } from '@/lib/storage-bucket-api';
import { getMeetingByBotId } from '@/queries';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';

import NotFoundPage from './not-found';
import FullSpinner from '@/components/loader';

const fetchMeeting = async (botId: string): Promise<MeetingT | null> => {
  if (!botId) throw new Error('No bot ID provided');

  const meeting: MeetingT | null | undefined = await getMeetingByBotId({ botId });
  if (!meeting) return null;

  if (meeting.type === 'local') {
    const storageAPI = new StorageBucketAPI('local_files');
    await storageAPI.init();

    const videoContent = await storageAPI.get(`${meeting.botId}.mp4`);
    if (videoContent && meeting.assets) meeting.assets.video_blob = videoContent;
  }

  return meeting || null;
};

function MeetingPage() {
  const { botId } = useParams();
  if (!botId) {
    return <NotFoundPage />;
  }
  const {
    data: meeting,
    isLoading,
    mutate,
  } = useSWR(`meeting_${botId}`, () => fetchMeeting(botId));
  if (!meeting) {
    if (isLoading) return <FullSpinner />
    return <NotFoundPage />;
  }
  return <Viewer botId={botId!} isLoading={isLoading} meeting={meeting} />;
}

export default MeetingPage;
