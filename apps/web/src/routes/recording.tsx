import type { Meeting as MeetingT } from '@/types';
import FullSpinner from '@/components/loader';
import { Viewer } from '@/components/viewer';
import { useApiKey } from '@/hooks/use-api-key';
import { fetchBotDetails } from '@/lib/meetingbaas';
import { StorageBucketAPI } from '@/lib/storage-bucket-api';
import { getMeetingByBotId, updateMeeting } from '@/queries';
import { useParams } from 'react-router-dom';
import useSWR, { mutate } from 'swr';

import NotFoundPage from './not-found';

const fetchMeeting = async (botId: string, baasApiKey: string | null | undefined): Promise<MeetingT | null> => {
  if (!botId) throw new Error('No bot ID provided');

  const meeting: MeetingT | null | undefined = await getMeetingByBotId({ botId });
  if (!meeting) return null;

  if (meeting.type === 'local') {
    const storageAPI = new StorageBucketAPI('local_files');
    await storageAPI.init();

    const videoContent = await storageAPI.get(`${meeting.botId}.mp4`);
    if (videoContent && meeting.assets) meeting.assets.video_blob = videoContent;
  }

  // refreshing the data
  if (meeting.type === 'meetingbaas' && !meeting.endedAt && baasApiKey) {
    const data = await fetchBotDetails({
      botId,
      apiKey: baasApiKey,
    });

    if (!data) return meeting;

    await updateMeeting({ id: meeting.id, values: { ...data } });
    // await mutate(['meeting', botId, baasApiKey],)
    return {
      ...meeting,
      ...data,
    };
  }

  return meeting;
};

function MeetingPage() {
  const { botId } = useParams();
  if (!botId) {
    return <NotFoundPage />;
  }
  const { apiKey: baasApiKey } = useApiKey({ type: 'meetingbaas' });
  const { data: meeting, isLoading } = useSWR(
    ['meeting', botId, baasApiKey],
    ([key, botId, baasApiKey]) => fetchMeeting(botId, baasApiKey),
    {
      refreshInterval: 5000,
    },
  );

  if (!meeting) {
    if (isLoading) return <FullSpinner />;
    return <NotFoundPage />;
  }
  return <Viewer botId={botId} isLoading={isLoading} meeting={meeting} />;
}

export default MeetingPage;
